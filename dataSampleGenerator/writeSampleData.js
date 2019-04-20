const { writeSampleCsv } = require('./dataSampleGen');

(async () => {
  try {
    await writeSampleCsv('cassandra');
    await writeSampleCsv('postgresql');
  } catch (e) {
    console.log(e);
  }
})();
