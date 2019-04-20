const { writeCsv } = require('./dataGen');

console.time('write postgresql data');
writeCsv('postgresql');
console.timeEnd('write postgresql data');
