const { writeCsv } = require('./dataGen');

console.time('write cassandra data');
writeCsv('cassandra');
console.time('write cassandra data');
