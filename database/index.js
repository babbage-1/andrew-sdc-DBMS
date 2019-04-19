const { Pool, Client } = require('pg');
const path = require('path');
const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'mydb',
  password: '',
  port: 5432,
});

(async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS MovieInfo(
        name VARCHAR(150) NOT NULL,
        genre VARCHAR(150) NOT NULL,
        score INT NOT NULL,
        runtime INT NOT NULL,
        rating VARCHAR(10) NOT NULL,
        releaseDay INT NOT NULL,
        releaseMonth VARCHAR(20) NOT NULL,
        releaseYear INT NOT NULL,
        image VARCHAR(250) NOT NULL
        );
    `);
    console.log('writing to database!');

    const copyPath = path.join(__dirname, '../sdcData.csv');
    await client.query(`
      COPY MovieInfo FROM '${copyPath}' WITH (FORMAT CSV, HEADER);
    `);

    console.log('done!');

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    console.log('error!');
    throw e;
  } finally {
    console.log('releasing...');
    client.release();
  }
})().catch(e => console.error(e.stack));
