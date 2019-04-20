const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: ['localhost'],
  localDataCenter: 'datacenter1',
});

client.connect((err) => {
  if (err) {
    console.log(err);
    throw err;
  }
  console.log('connected to cassandra!');
});
