const express = require("express");
const router = express.Router();
const api = "/api/v1"
const submitSQLQuery = require("../dbHandler");

const tableName = 'job_postings';

/**
 * Get number of job postings that matches search string within given year range grouped by month.
 */
router.post(`${api}/search`, async (req, res) => {
    const { searchString, min, max } = req.body;

    if (searchString.length < 3) {
        return res.status(400);
    }

    const queryString = `
        SELECT
            EXTRACT(YEAR FROM publication_date) AS year,
            EXTRACT(MONTH FROM publication_date) AS month,
        COUNT(*) AS total_postings
        FROM ${tableName}
        WHERE
            publication_date BETWEEN $2 AND $3
            AND (
                headline ILIKE '%' || $1 || '%'
            OR EXISTS (
                SELECT 1 FROM unnest(keywords_skill) AS skill
                WHERE skill ILIKE '%' || $1 || '%'
            )
            OR occupation_label ILIKE '%' || $1 || '%'
            OR occupation_field_label ILIKE '%' || $1 || '%'
            OR occupation_group_label ILIKE '%' || $1 || '%'
            )
        GROUP BY year, month
        ORDER BY year, month;
    `
    const params = [searchString, min, max];
    await submitSQLQuery(queryString, params, res);
});

/**
 * Get all unique occupation groups and their counts within a time range
 */
router.post(`${api}/search/description`, async (req, res) => {
    const { searchString, min, max } = req.body;
    console.log(req.body);
    

    const queryString = `
        SELECT 
            date_trunc('month', publication_date)::date as date,
            COUNT(*) AS total_postings
        FROM job_postings
        WHERE to_tsvector('swedish', description_text) @@ plainto_tsquery('swedish', $1)
        AND publication_date BETWEEN $2 AND $3
        GROUP BY date
        ORDER BY date;
    `;

    const params = [searchString, min, max];
    console.log(searchString);
    
    await submitSQLQuery(queryString, params, res);
});

/**
 * Get all unique occupation groups and their counts within a time range
 */
router.post(`${api}/search/headline`, async (req, res) => {
    const { searchString, min, max } = req.body;
    console.log(req.body);
    

    const queryString = `
        SELECT 
            date_trunc('month', publication_date)::date as date,
            COUNT(*) AS total_postings
        FROM job_postings
        WHERE to_tsvector('swedish', headline) @@ plainto_tsquery('swedish', $1)
        AND publication_date BETWEEN $2 AND $3
        GROUP BY date
        ORDER BY date;
    `;

    const params = [searchString, min, max];
    console.log(searchString);
    
    await submitSQLQuery(queryString, params, res);
});

/**
 * Get all unique occupation groups and their counts within a time range
 */
router.post(`${api}/search/headline_description`, async (req, res) => {
    const { searchString, min, max, descriptionString } = req.body;
    console.log(req.body);
    

    const queryString = `
        SELECT 
            date_trunc('month', publication_date)::date as date,
            COUNT(*) AS total_postings
        FROM job_postings 
        WHERE to_tsvector('swedish', headline) @@ plainto_tsquery('swedish', $1)
        AND to_tsvector('swedish', description_text) @@ plainto_tsquery('swedish', $4)
        AND publication_date BETWEEN $2 AND $3
        GROUP BY date
        ORDER BY date;
    `;

    const params = [searchString, min, max, descriptionString];
    console.log(searchString);
    
    await submitSQLQuery(queryString, params, res);
});


module.exports = router;