const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: ['localhost'],
  localDataCenter: 'datacenter1',
});

async function connectAndCheckCassandra() {
  try {
    var t = process.hrtime();
    await client.connect();
    console.log('Connected to cluster with %d host(s): %j', client.hosts.length, client.hosts.keys());
    client.hosts.forEach((host) => {
      console.log(host.address, host.datacenter, host.rack, host.isUp(), host.canBeConsideredAsUp());
    });
    await client.shutdown();
    console.log('client shutdown');
  } catch (e) {
    console.log(e);
    throw e;
  } finally {

    await client.shutdown();
    console.log('client shutdown');
    var tEnd = process.hrtime(t);
    console.log('time end', tEnd);
  }
}
connectAndCheckCassandra();
