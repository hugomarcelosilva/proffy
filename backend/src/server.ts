import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

import routes from './routes';

const app = express();

const dir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(process.env.PORT || 3333, () => {
  console.log('Server started!');
});
