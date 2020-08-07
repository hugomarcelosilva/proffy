import knex from 'knex';
import 'dotenv/config';

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
  useNullAsDefault: true,
});

export default db;
