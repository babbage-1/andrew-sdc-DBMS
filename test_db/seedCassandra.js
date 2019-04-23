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
    const createTablespaceQuery = `
    CREATE KEYSPACE IF NOT EXISTS sdcandrew
    WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 1}`;

    const createTable = `
      CREATE TABLE IF NOT EXISTS movieInfo (
      id int,
      name varchar,
      genre varchar,
      score smallint,
      runtime smallint,
      rating varchar,
      releaseDay smallint,
      releaseMonth varchar,
      releaseYear smallint,
      image varchar,
      PRIMARY KEY (id, score)
    )`;
    // WITH CLUSTERING ORDER BY(id ASC)
    await client.execute(createTablespaceQuery);
    await client.execute('USE sdcandrew');
    await client.execute(createTable);
  } catch (e) {
    console.log(e);
  } finally {
    await client.shutdown();
    console.log('client shutdown');
  }
}
seedCassandra();

/*
  CAN'T USE cqlsh commands in node! Have to copy this command in cqlsh within bash! use npm script "seed:cassandra" or "seed:cassandraSample"

  SEE cassandra.cql or cassandra-sample.cql for list of commands used, COPY command used shown below

  ** For Sample Data Seed **
  COPY testmovieinfo(id, name, genre, score, runtime, rating, releaseDay, releaseMonth, releaseYear, image) FROM '~/code/my_own/Capston_Projects/sdc/andrew-sdc-data-generation/sdc-sample-cassandra-data.csv' WITH HEADER = TRUE AND NUMPROCESSES = 10 AND CHUNKSIZE = 1000 AND MAXBATCHSIZE = 15;

  ** For 10M Data Seed **
  COPY movieinfo(id, name, genre, score, runtime, rating, releaseDay, releaseMonth, releaseYear, image) FROM '~/code/my_own/Capston_Projects/sdc/andrew-sdc-data-generation/sdc-cassandra-data.csv' WITH HEADER = TRUE AND NUMPROCESSES = 10 AND CHUNKSIZE = 1000 AND MAXBATCHSIZE = 15;

*/
