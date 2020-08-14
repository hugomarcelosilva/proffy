import express from 'express';
import multer from 'multer';

import ClassesController from './controllers/ClassesController';
import ConnectionsController from './controllers/ConnectionsController';
import ProfilesController from './controllers/ProfilesController';
import SessionsController from './controllers/SessionsController';
import UsersController from './controllers/UsersController';

import Auth from './middlewares/auth';
import multerConfig from './config/multer';

const authMiddleware = new Auth();

const upload = multer(multerConfig);

const routes = express.Router();
const classesController = new ClassesController();
const connectionsController = new ConnectionsController();
const profilesController = new ProfilesController();
const sessionsController = new SessionsController();
const usersController = new UsersController();

routes.get('/users', usersController.index);
routes.post('/users', usersController.create);
routes.post('/forgot-password', usersController.forgotPassword);
routes.post('/reset-password', usersController.resetPassword);

routes.post('/sessions', sessionsController.create);

routes.get('/classes', authMiddleware.auth, classesController.index);
routes.get('/classes/:id', authMiddleware.auth, classesController.show);
routes.get(
  '/classes/schedules/:id',
  authMiddleware.auth,
  classesController.showSchedules,
);
routes.post('/classes/:id', authMiddleware.auth, classesController.create);

routes.get('/connections', authMiddleware.auth, connectionsController.index);
routes.post('/connections', authMiddleware.auth, connectionsController.create);

routes.put('/profiles/:id', authMiddleware.auth, profilesController.update);
routes.put(
  '/profiles/avatar/:id',
  authMiddleware.auth,
  upload.single('avatar'),
  profilesController.updateAvatar,
);

export default routes;
