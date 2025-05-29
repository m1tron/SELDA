require('dotenv').config();
const { Pool } = require('pg');
console.log();


const pool = new Pool({
    user: process.env.DATABASE_USER || 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    database: process.env.DATABASE_NAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'password',
    client_encoding: 'UTF8',
})

/**
 * Submit SQL query to the database
 * @param query query string
 * @param params query parameters
 * @param res response object
 * @returns {Promise<void>}
 */
async function submitSQLQuery(query, params, res) {
    console.log(new Date().toLocaleString("sv-SE") + " running SQL query.");
    const result = await pool.query(query, params);
    //console.log(result);
    
    if (result.rows.length === 0) {
        return res.status(404).send("No results found");
    }
    console.log(result.rows);
    
    res.json(result);
}

module.exports = submitSQLQuery;