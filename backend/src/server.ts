import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';

const app = express();

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(process.env.PORT || 3333);
