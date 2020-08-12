import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { object, string } from 'yup';

import db from '../database/connection';
import authConfig from '../config/auth';
import MailService from '../services/mailer';

interface TokenPayload {
  email: string;
}

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
    const { name, email, password } = request.body;

    const schema = object().shape({
      name: string().required(),
      email: string().email().required(),
      password: string().required(),
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
      });

      return response.status(201).send();
    } catch (err) {
      return response.status(400).json({
        error: 'Unexpected error while creating new user',
      });
    }
  }

  async forgotPassword(request: Request, response: Response) {
    const { email } = request.body;

    try {
      const user = await db('users').select().where({ email });

      if (!user[0])
        return response.status(400).send({ error: 'User not exists' });

      const { name } = user[0];

      const { secret } = authConfig.jwt;

      const token = sign({ email }, secret, {
        expiresIn: '1h',
      });

      const serializedLink =
        `${process.env.APP_WEB_URL}/reset-password/` + token;

      await MailService.sendEmail({
        to: {
          name,
          address: email,
        },
        subject: 'Proffy - Recuperação de senha',
        body:
          '<p> Olá, proffy. Fiquei sabendo que perdeu sua senha, segue abaixo um link para recuperá-la. </p>' +
          `<p><a href="${serializedLink}">Clique aqui!</a></p>`,
      });

      return response.send();
    } catch (error) {
      return response.status(400).json({
        error: 'Unexpected error while processing the forgotten password',
      });
    }
  }

  async resetPassword(request: Request, response: Response) {
    const { token, password } = request.body;

    const { secret } = authConfig.jwt;

    try {
      const decoded = verify(token, secret);

      const { email } = decoded as TokenPayload;

      const hashedPass = await bcrypt.hash(password, 8);

      await db('users')
        .select()
        .where({
          email,
        })
        .update({
          password: hashedPass,
        });

      return response.send();
    } catch (err) {
      return response.status(400).json({
        error: 'Unexpected error while reseting password',
      });
    }
  }
}
