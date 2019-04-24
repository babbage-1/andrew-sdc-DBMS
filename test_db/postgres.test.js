/* eslint-disable no-await-in-loop */
const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'sdcandrew',
  password: '',
  port: 5432,
});

// const connectPostgres = async () => {
//   await pool.connect();
// };
// const disconnectPostgres = async () => {
//   await pool.release();
// };

beforeAll(async () => {
  await client.connect();
});

afterAll(async () => {
  await client.end();
});

describe('Postgres DBMS Benchmarking with 10M data points', () => {
  test('Reading movie info from DB returns correct data structure', async () => {
    try {
      const queryString = 'SELECT * FROM movieinfo WHERE id = 1';
      const res = await client.query(queryString);
      const dataObj = res.rows[0];

      expect(dataObj).toEqual(expect.objectContaining({
        genre: expect.any(String),
        id: expect.any(Number),
        image: expect.any(String),
        name: expect.any(String),
        rating: expect.any(String),
        releaseday: expect.any(Number),
        releasemonth: expect.any(String),
        releaseyear: expect.any(Number),
        runtime: expect.any(Number),
        score: expect.any(Number),
      }));
    } catch (e) {
      console.log(e);
    }
  });

  test('Reading movie info from database takes less than 50ms on average for 1000 queries', async () => {
    try {
      // intialize time total
      let totalTimeInMs = 0;

      // iterate through last 100 data points in db
      const runQs = async () => {
        for (let i = (9999000); i <= (10000000); i += 1) {
          const text = 'SELECT * FROM movieinfo WHERE id = $1';
          const values = [i];

          // measure time to finish retreiving result for query
          const t = process.hrtime();
          const res = await client.query(text, values);
          if (i === 9999000) {
            console.log('SAMPLE data output\n', res.rows[0]);
          }
          const tEnd = process.hrtime(t);

          // add time instance to time total after converting nanoseconds to milliseconds
          totalTimeInMs += (tEnd[1] / 1000000);
        }
      };
      await runQs();
      const average = totalTimeInMs / 1000;
      console.log('what is AVERAGE QUERY TIME in milliseconds?\n', average);

      // expect average to be less than 50ms and NOT zero.
      expect(average).toBeTruthy();
      expect(average).toBeLessThan(50);
    } catch (e) {
      console.log(e);
    }
  });
});
