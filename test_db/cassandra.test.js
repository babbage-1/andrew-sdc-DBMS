/* eslint-disable no-await-in-loop */
/* eslint-disable block-scoped-var */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */

/*
NOT SURE WHY! but closing cassandra-driver connection async seems to be buggy.
In consistent in closing with asyn/await

Figure out later!
*/
const cassandra = require('cassandra-driver');

var client = new cassandra.Client({
  contactPoints: ['localhost'],
  localDataCenter: 'datacenter1',
  keyspace: 'sdc_andrew',
});

describe('connection to Cassandra established', () => {
  test('can output connection details', async () => {
    try {
      await client.connect();
      console.log('Connected to cluster with %d host(s): %j', client.hosts.length, client.hosts.keys());
      // client.hosts.forEach((host) => {
      //   console.log(host.address, host.datacenter, host.rack, host.isUp(), host.canBeConsideredAsUp());
      // });
    } catch (e) {
      console.log(e);
      throw e;
    }
  });
});

describe('Cassandra DBMS Benchmarking with 10M data points', () => {
  test('Reading movie info from DB returns correct data structure', async () => {
    try {
      await client.connect();
      const query = 'SELECT * FROM movieinfo WHERE id = 1 ALLOW FILTERING';
      const result = await client.execute(query);
      const dataObj = result.rows[0];

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
      throw e;
    }
  });

  test('Reading movie info from database takes less than 50ms on average for 1000 queries', async () => {
    try {
      await client.connect();
      // intialize time total
      let totalTimeInMs = 0;
      // iterate through last 100 data points in db
      const runQs = async () => {
        for (var i = (9999000); i <= (10000000); i += 1) {
          const query = 'SELECT * FROM movieinfo WHERE id = ? ALLOW FILTERING';
          const params = [i];

          // measure time to finish retreiving result for query
          const t = process.hrtime();
          const result = await client.execute(query, params, { hints: ['int'], prepare: true });
          if (i === 9999000) {
            console.log('SAMPLE data output\n', result.rows[0]);
          }
          const tEnd = process.hrtime(t);
          // add time instance to time total after converting nanoseconds to milliseconds
          totalTimeInMs += (tEnd[1] / 1000000);
        }
      };
      await runQs();
      const average = totalTimeInMs / 1000;
      console.log('what is AVERAGE QUERY TIME in milliseconds?\n', average);
      // expect average to be less than 50ms and NOT zero
      expect(average).toBeTruthy();
      expect(average).toBeLessThan(50);
    } catch (e) {
      console.log(e);
    } finally {
      await client.shutdown();
    }
  });
});
