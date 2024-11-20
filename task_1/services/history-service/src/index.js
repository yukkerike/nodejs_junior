const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3002;

const pool = new Pool({
    host: 'postgres',
    port: 5432,
    database: 'inventory_db',
    user: 'postgres',
    password: 'postgres'
});

app.use(express.json());

app.post('/events', async (req, res) => {
    const { 
        inventory_id, 
        action, 
        old_shelf_quantity,
        new_shelf_quantity,
        old_order_quantity,
        new_order_quantity
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO inventory_logs 
            (inventory_id, action, old_shelf_quantity, new_shelf_quantity, 
             old_order_quantity, new_order_quantity) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, 
            [
                inventory_id, 
                action, 
                old_shelf_quantity,
                new_shelf_quantity,
                old_order_quantity,
                new_order_quantity
            ]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/history', async (req, res) => {
    const { 
        inventory_id, 
        start_date, 
        end_date, 
        action,
        page = 1,
        limit = 10
    } = req.query;

    try {
        const offset = (page - 1) * limit;
        
        let query = 'SELECT * FROM inventory_logs WHERE 1=1';
        let countQuery = 'SELECT COUNT(*) FROM inventory_logs WHERE 1=1';
        const params = [];
        let paramIndex = 1;

        if (inventory_id) {
            query += ` AND inventory_id = $${paramIndex}`;
            countQuery += ` AND inventory_id = $${paramIndex}`;
            params.push(inventory_id);
            paramIndex++;
        }
        
        if (start_date) {
            query += ` AND changed_at >= $${paramIndex}`;
            countQuery += ` AND changed_at >= $${paramIndex}`;
            params.push(start_date);
            paramIndex++;
        }
        
        if (end_date) {
            query += ` AND changed_at <= $${paramIndex}`;
            countQuery += ` AND changed_at <= $${paramIndex}`;
            params.push(end_date);
            paramIndex++;
        }
        
        if (action) {
            query += ` AND action = $${paramIndex}`;
            countQuery += ` AND action = $${paramIndex}`;
            params.push(action);
            paramIndex++;
        }

        query += ` ORDER BY changed_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limit, offset);

        const [result, countResult] = await Promise.all([
            pool.query(query, params),
            pool.query(countQuery, params.slice(0, -2))
        ]);

        res.json({
            data: result.rows,
            total: parseInt(countResult.rows[0].count),
            page: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`History service running on port ${port}`);
});