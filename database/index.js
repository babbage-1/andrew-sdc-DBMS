const { Pool, Client } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'mydb',
  password: '',
  port: 5432,
});

// pool.query('SELECT NOW()', (err, res) => {
//   console.log('i did a query!');
//   console.log(err, res);
//   pool.end();
// });

(async () => {
  // note: we don't try/catch this because if connecting throws an exception
  // we don't need to dispose of the client (it will be undefined)
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

    await client.query(`
      COPY MovieInfo FROM '/Users/exitright/code/my_own/Capston_Projects/sdc/andrew-sdc-data-generation/sdcData.csv' WITH (FORMAT CSV, HEADER);
    `);

    console.log('writing to database!');

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    console.log('error!');
    throw e;
  } finally {
    console.log('hello?');
    client.release();
  }
})().catch(e => console.error(e.stack));
