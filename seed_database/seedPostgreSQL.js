const { Pool } = require('pg');
const path = require('path');
const { config } = require('./config');
const pool = new Pool(config);

const seedPostgres = async () => {
  const client = await pool.connect();

  try {
    console.time('timing seed');
    // Transaction BEGIN!
    await client.query('BEGIN');
    console.log('creating movieinfo table!');
    await client.query(`
      CREATE TABLE IF NOT EXISTS MovieInfo(
        name VARCHAR(150) NOT NULL,
        genre VARCHAR(150) NOT NULL,
        score SMALLINT NOT NULL,
        runtime SMALLINT NOT NULL,
        rating VARCHAR(10) NOT NULL,
        releaseDay SMALLINT NOT NULL,
        releaseMonth VARCHAR(20) NOT NULL,
        releaseYear SMALLINT NOT NULL,
        image VARCHAR(250) NOT NULL
        );
    `);

    console.log('writing to database!');


    const copyPath = path.join(__dirname, '../sdc-postgresql-data.csv');
    await client.query(`
      COPY MovieInfo FROM '${copyPath}' WITH (FORMAT CSV, HEADER);
    `);

    console.log('adding auto serial index column named "id"!');
    await client.query(`
      ALTER TABLE movieinfo ADD COLUMN id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY;
    `);
    // NOT CONCURRENTLY, NOT MULTI COLUMN (releaseyear)

    console.log('commiting!');
    await client.query('COMMIT');
    // Transaction END!
    console.timeEnd('timing seed');
  } catch (e) {
    await client.query('ROLLBACK');
    console.log('error!');
    throw e;
  } finally {
    console.log('releasing...');
    client.release();
  }
};

seedPostgres().catch(e => console.error(e.stack));
