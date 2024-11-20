const express = require("express");
const pool = require("../db");
const router = express.Router();

router.post("/", async (req, res) => {
    const { plu, name, description } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO products (plu, name, description) VALUES ($1, $2, $3) RETURNING *",
            [plu, name, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/", async (req, res) => {
    const { name, plu } = req.query;
    try {
        let query = "SELECT * FROM products WHERE 1=1";
        const params = [];
        let paramIndex = 1;

        if (name) {
            query += ` AND name ILIKE $${paramIndex}`;
            params.push(`%${name}%`);
            paramIndex++;
        }

        if (plu) {
            query += ` AND plu = $${paramIndex}`;
            params.push(plu);
        }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
