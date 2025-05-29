

## Postgres installation

We have chosen Postgres for our database. It is probably the most feature rich open source database. It even supports JSON out of the box. Below we will detail how we setup our database, but note that in real world circumstances one would use more suitable strings for name, password and user.

```sh

# Install postgres
> brew install postgresql

# Start postgres
> brew services start postgresql

# Login to server using psql
> psql -U postgres

# (OPTIONAL) Create new user
postgres> CREATE ROLE newUser WITH LOGIN PASSWORD ‘password’

# (OPTIONAL) Give user DB creation privileges
postgres> ALTER ROLE newUser CREATEDB

# (OPTIONAL) Quit psql, and login as newUser
postgres> \q
> psql postgres -U newuser

# (OPTIONAL) List postgres server roles
postgres> \du

```
---
## Data source - Platsbanken

This project uses the open JobAds API by the Swedish Employment Agency. In addition to a rest API, they supply downloadable
data sets for each year. The data sets are the optimal solution for us (and recommended by their developers) for doing
long term statistics. The data and information about it is available here https://gitlab.com/arbetsformedlingen/job-ads/getting-started-code-examples/historical-ads-info/-/blob/main/Files.md.


### Python solution for preparing JSON for Postgres

This repo supplies a parsing utility in `~/main.py`. It can be started from any IDE or from commandline if python is installed `python main.py.`. Running it will present the use with two options; to either split a JSONL file (useful for limiting dataset), or clean it for import to Postgres. The original data contains many different nested control characters that are incompatible with the Postgres PSQL import function.

## SQL Schema

```sql
CREATE TABLE job_postings (
    id SERIAL PRIMARY KEY,
    description_company_information TEXT,
    description_text TEXT,
    detected_language TEXT,
    duration_label TEXT,
    employer_name TEXT,
    employment_type_label TEXT,
    headline TEXT,
    larling BOOLEAN,
    occupation_label TEXT,
    occupation_field_label TEXT,
    occupation_group_label TEXT,
    publication_date TIMESTAMP,
    remote_work BOOLEAN,
    salary_type_label TEXT,
    trainee BOOLEAN,
    working_hours_type_label TEXT,
    workplace_municipality TEXT,
    workplace_country TEXT,
    workplace_region TEXT,
    keywords_skill TEXT[],
    keywords_trait TEXT[]
);
```

## Data migration

## Step 1 - Load data into temporary table
```sh
# Start psql
> psql postgres -U newuser

# Create a table for jsonb import. Table name 'temp', column name 'data' and type "jsonb".
postgres> CREATE TABLE temp (data jsonb);

# NOTE! On Windows you might encounter problems if postgres is configured to use WIN1252 formatting. In that case, run:
postgres> SET client_encoding = 'UTF8';

# Load the data prepared from the python script
postgres> \COPY temp (data) FROM '~/2019.enriched_fixed.jsonl';
```

## Step 2 - Load data into the real table

```sql
INSERT INTO job_postings (
    description_company_information,
    description_text,
    detected_language,
    duration_label,
    employer_name,
    employment_type_label,
    headline,
    larling,
    occupation_label,
    occupation_field_label,
    occupation_group_label,
    publication_date,
    remote_work,
    salary_type_label,
    trainee,
    working_hours_type_label,
    workplace_municipality,
    workplace_country,
    workplace_region,
    keywords_skill
)
SELECT 
    data->'description'->>'company_information',
    data->'description'->>'text',
    data->>'detected_language',
    data->'duration'->>'label',
    data->'employer'->>'name',
    (data->'employment_type'->0)->>'label',
    data->>'headline',
    (data->>'larling')::BOOLEAN,
    (data->'occupation'->0)->>'label',
    (data->'occupation_field'->0)->>'label',
    (data->'occupation_group'->0)->>'label',
    (data->>'publication_date')::TIMESTAMP,
    (data->>'remote_work')::BOOLEAN,
    data->'salary_type'->>'label',
    (data->>'trainee')::BOOLEAN,
    data->'working_hours_type'->>'label',
    data->'workplace_address'->>'municipality',
    data->'workplace_address'->>'country',
    data->'workplace_address'->>'region',
    ARRAY(
        SELECT jsonb_array_elements_text(data->'keywords'->'enriched'->'skill')
    ),
    ARRAY(
    SELECT jsonb_array_elements_text(data->'keywords'->'enriched'->'trait')
    )
FROM temp;
```

## Indexing

### The problem
Indexing select columns can greatly speed up querying. Initial results showed that free-text searches like this takes 5 seconds (using 2019 data with 640k rows):
```sql
SELECT headline
FROM jobs 
WHERE description_text like '%java%'
```
The time taken of course increases more than tenfold if all current data (as of 2025) is imported (6.8m rows). Any query using linear search against a dataset of this size is bound to fail over HTTP. Thus, indexing is essential to make real time visualization possible.

### Text search indexing
Postgres provides several tools for indexing data. The [recommended](https://www.postgresql.org/docs/current/textsearch-indexes.html) type is GIN indexing .

```sql
CREATE INDEX idx_description_fts 
ON jobs USING GIN (to_tsvector('swedish', description_text));
```

### Prepared Statements
Using prepared statements on the postgres server can speed up queries. Here is one query we prepared for free text searching
the description_text field and returning results per month.
```sql
PREPARE text_search_hits_by_month(text) AS
SELECT 
    TO_CHAR(publication_date, 'YYYY-MM') AS year_month, 
    COUNT(*) AS job_count
FROM job_postings
WHERE to_tsvector('swedish', description_text) @@ plainto_tsquery('swedish', $1) 
-- Use phrase_tsquery() for phrases.
GROUP BY year_month
ORDER BY year_month;
```