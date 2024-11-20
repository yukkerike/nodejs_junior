const express = require('express');
const pool = require('../db.js');

const router = express.Router();

router.post('/', async (req, res) => {
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

module.exports = router;