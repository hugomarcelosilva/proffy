import express from 'express';

import ClassesController from './controllers/ClassesController';
import ConnectionsController from './controllers/ConnectionsController';
import SessionsController from './controllers/SessionsController';
import UsersController from './controllers/UsersController';

import Auth from './middlewares/auth';

const authMiddleware = new Auth();

const routes = express.Router();
const classesController = new ClassesController();
const connectionsController = new ConnectionsController();
const sessionsController = new SessionsController();
const usersController = new UsersController();

routes.get('/users', usersController.index);
routes.post('/users', usersController.create);

routes.post('/sessions', sessionsController.create);

routes.get('/classes', authMiddleware.auth, classesController.index);
routes.post('/classes', authMiddleware.auth, classesController.create);

routes.get('/connections', authMiddleware.auth, connectionsController.index);
routes.post('/connections', authMiddleware.auth, connectionsController.create);

export default routes;
