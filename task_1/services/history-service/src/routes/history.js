const express = require("express");
const pool = require("../db.js");

const router = express.Router();

router.get("/", async (req, res) => {
    const {
        inventory_id,
        start_date,
        end_date,
        action,
        page = 1,
        limit = 10,
    } = req.query;

    try {
        const offset = (page - 1) * limit;

        let query = "SELECT * FROM inventory_logs WHERE 1=1";
        let countQuery = "SELECT COUNT(*) FROM inventory_logs WHERE 1=1";
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

        query += ` ORDER BY changed_at DESC LIMIT $${paramIndex} OFFSET $${
            paramIndex + 1
        }`;
        params.push(limit, offset);

        const [result, countResult] = await Promise.all([
            pool.query(query, params),
            pool.query(countQuery, params.slice(0, -2)),
        ]);

        res.json({
            data: result.rows,
            total: parseInt(countResult.rows[0].count),
            page: parseInt(page),
            limit: parseInt(limit),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
