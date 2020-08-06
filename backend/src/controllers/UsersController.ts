import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { object, string } from 'yup';

import db from '../database/connection';

export default class UsersController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const users = await db('users').select('*');

      return response.json(users);
    } catch (error) {
      next(error);
    }
  }

  async create(request: Request, response: Response) {
    const { name, email, password, avatar, whatsapp, bio } = request.body;

    const schema = object().shape({
      name: string().required(),
      email: string().email().required(),
      password: string().required(),
      avatar: string().required(),
      whatsapp: string().required(),
      bio: string().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Validation fails' });
    }

    const user = await db('users').select().where('email', email);

    if (user[0])
      return response.status(400).send({ error: 'User already exists' });

    try {
      const salt = bcrypt.genSaltSync(10);

      await db('users').insert({
        name,
        email,
        password: bcrypt.hashSync(password, salt),
        avatar,
        whatsapp,
        bio,
      });

      return response.status(201).send();
    } catch (err) {
      return response.status(400).json({
        error: 'Unexpected error while creating new user',
      });
    }
  }
}
