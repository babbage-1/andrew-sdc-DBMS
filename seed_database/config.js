/* eslint-disable global-require */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: './postgres.env' });
}

const config = {
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
};

module.exports = {
  config,
};
