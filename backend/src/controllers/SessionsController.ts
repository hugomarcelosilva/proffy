import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import db from '../database/connection';
import authConfig from '../config/auth';

export default class SessionsController {
  async create(request: Request, response: Response) {
    try {
      await db('users')
        .select('*')
        .where('email', request.body.email)
        .then((users: any) => {
          if (users.length == undefined || users.length == 0)
            return response.status(400).send({ error: 'User not found' });

          if (!bcrypt.compareSync(request.body.password, users[0].password))
            return response.status(400).send({ error: 'Password error' });

          const user = users[0];

          const { secret, expiresIn } = authConfig.jwt;

          return response.send({
            user,
            token: sign({}, secret, {
              expiresIn,
            }),
          });
        });
    } catch (err) {
      return response.status(400).json({
        error: 'Unexpected error auth',
      });
    }
  }
}
