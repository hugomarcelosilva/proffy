import path from 'path';
import 'dotenv/config';

module.exports = {
  client: 'pg',

  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
  migrations: {
    directory: path.resolve(__dirname, 'src', 'database', 'migrations'),
  },
  useNullAsDefault: true,
};
