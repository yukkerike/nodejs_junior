const express = require('express');
const axios = require('axios');
const pool = require('../db');
const router = express.Router();

router.post('/', async (req, res) => {
    const { product_id, shop_id, shelf_quantity, order_quantity } = req.body;

    try {
        const inventoryResult = await pool.query(
            'INSERT INTO inventories (product_id, shop_id, shelf_quantity, order_quantity) VALUES ($1, $2, $3, $4) RETURNING *', 
            [product_id, shop_id, shelf_quantity, order_quantity]
        );

        const newInventoryId = inventoryResult.rows[0].id;

        await axios.post('http://history-service:3002/events', {
            inventory_id: newInventoryId,
            action: 'inventory_created',
            old_shelf_quantity: 0,
            new_shelf_quantity: shelf_quantity,
            old_order_quantity: 0,
            new_order_quantity: order_quantity
        });

        
        res.status(201).json(inventoryResult.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/:id/increase', async (req, res) => {
    const { id } = req.params;
    let { shelf_quantity, order_quantity } = req.body;

    shelf_quantity = shelf_quantity || 0;
    order_quantity = order_quantity || 0;


    try {
        const inventoryResult = await pool.query(
            'SELECT shelf_quantity, order_quantity FROM inventories WHERE id = $1 FOR UPDATE', 
            [id]
        );

        const oldShelfQuantity = inventoryResult.rows[0].shelf_quantity;
        const oldOrderQuantity = inventoryResult.rows[0].order_quantity;

        const updatedResult = await pool.query(
            'UPDATE inventories SET shelf_quantity = shelf_quantity + $1, order_quantity = order_quantity + $2 WHERE id = $3 RETURNING *', 
            [shelf_quantity, order_quantity, id]
        );

        await axios.post('http://history-service:3002/events', {
            inventory_id: id,
            action: 'inventory_increased',
            old_shelf_quantity: oldShelfQuantity,
            new_shelf_quantity: updatedResult.rows[0].shelf_quantity,
            old_order_quantity: oldOrderQuantity,
            new_order_quantity: updatedResult.rows[0].order_quantity
        });

        res.json(updatedResult.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/:id/decrease', async (req, res) => {
    const { id } = req.params;
    let { shelf_quantity, order_quantity } = req.body;

    shelf_quantity = shelf_quantity || 0;
    order_quantity = order_quantity || 0;

    try {
        const inventoryResult = await pool.query(
            'SELECT shelf_quantity, order_quantity FROM inventories WHERE id = $1 FOR UPDATE', 
            [id]
        );

        const oldShelfQuantity = inventoryResult.rows[0].shelf_quantity;
        const oldOrderQuantity = inventoryResult.rows[0].order_quantity;

        if (oldShelfQuantity < shelf_quantity || oldOrderQuantity < order_quantity) {
            throw new Error('Недостаточно товара');
        }

        const updatedResult = await pool.query(
            'UPDATE inventories SET shelf_quantity = shelf_quantity - $1, order_quantity = order_quantity - $2 WHERE id = $3 RETURNING *', 
            [shelf_quantity, order_quantity, id]
        );

        await axios.post('http://history-service:3002/events', {
            inventory_id: id,
            action: 'inventory_decreased',
            old_shelf_quantity: oldShelfQuantity,
            new_shelf_quantity: updatedResult.rows[0].shelf_quantity,
            old_order_quantity: oldOrderQuantity,
            new_order_quantity: updatedResult.rows[0].order_quantity
        });

        res.json(updatedResult.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    const { 
        plu, 
        shop_id, 
        min_shelf_quantity, 
        max_shelf_quantity, 
        min_order_quantity, 
        max_order_quantity 
    } = req.query;

    try {
        let query = `
            SELECT i.*, p.plu, p.name 
            FROM inventories i
            JOIN products p ON i.product_id = p.id
            WHERE 1=1
        `;
        const params = [];
        let paramIndex = 1;

        if (plu) {
            query += ` AND p.plu = $${paramIndex}`;
            params.push(plu);
            paramIndex++;
        }

        if (shop_id) {
            query += ` AND i.shop_id = $${paramIndex}`;
            params.push(shop_id);
            paramIndex++;
        }

        if (min_shelf_quantity) {
            query += ` AND i.shelf_quantity >= $${paramIndex}`;
            params.push(min_shelf_quantity);
            paramIndex++;
        }

        if (max_shelf_quantity) {
            query += ` AND i.shelf_quantity <= $${paramIndex}`;
            params.push(max_shelf_quantity);
            paramIndex++;
        }

        if (min_order_quantity) {
            query += ` AND i.order_quantity >= $${paramIndex}`;
            params.push(min_order_quantity);
            paramIndex++;
        }

        if (max_order_quantity) {
            query += ` AND i.order_quantity <= $${paramIndex}`;
            params.push(max_order_quantity);
        }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;