const express = require("express");
const router = express.Router();
const api = "/api/v1"
const tableName = 'job_postings';
const submitSQLQuery = require("../dbHandler");

/**
 * Get all unique occupation groups and their counts
 */
router.post(`${api}/occupations`, async (req, res) => {
    const { min, max } = req.body;

    const queryString = `
        SELECT occupation_field_label, COUNT(*) AS count
        FROM ${tableName}
        WHERE publication_date BETWEEN $1 AND $2
        GROUP BY occupation_field_label
        ORDER BY count DESC;
    `;
    await submitSQLQuery(queryString, [min, max], res);
});


module.exports = router;