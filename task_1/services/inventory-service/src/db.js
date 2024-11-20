const { Pool } = require("pg");

const pool = new Pool({
    host: "postgres",
    port: 5432,
    database: "inventory_db",
    user: "postgres",
    password: "postgres",
});

module.exports = pool;
