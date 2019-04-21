const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: ['localhost'],
  localDataCenter: 'datacenter1',
});

async function connectAndCheckCassandra() {
  try {
    await client.connect();
    console.log('Connected to cluster with %d host(s): %j', client.hosts.length, client.hosts.keys());
    client.hosts.forEach((host) => {
      console.log(host.address, host.datacenter, host.rack, host.isUp(), host.canBeConsideredAsUp());
    });
    // await client.shutdown();
    // console.log('client shutdown');
  } catch (e) {
    console.log(e);
    throw e;
  }
}
connectAndCheckCassandra();

async function seedCassandra() {
  try {
    const createTablespaceQuery = "CREATE KEYSPACE IF NOT EXISTS sdcandrew WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 1}";

    const createTable = `
      CREATE TABLE IF NOT EXISTS movieInfo (
      id int,
      name varchar,
      genre varchar,
      score smallint,
      runtime smallint,
      releaseDay smallint,
      releaseMonth varchar,
      releaseYear smallint,
      image varchar,
      PRIMARY KEY (id)
    )`;

    const copyCSV = `
    COPY movieInfo (id, name, genre, score, runtime, releaseDay, releaseMonth, releaseYear, image) FROM '../sdc-sample-cassandra-data.csv' WITH HEADER = TRUE
    `;

    await client.execute(createTablespaceQuery);
    await client.execute('USE sdcandrew');
    await client.execute(createTable);


  } catch (e) {
    console.log(e);
    await client.shutdown();
    console.log('client shutdown');
  } finally {
    await client.shutdown();
    console.log('client shutdown');
  }
}
seedCassandra();
