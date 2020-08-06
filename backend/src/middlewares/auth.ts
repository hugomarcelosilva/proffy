import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import authConfig from '../config/auth';

export default class Auth {
  async auth(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return response.status(401).json({ error: 'Token not provided' });
    }

    const parts = authHeader.split(' ');

    if (!(parts.length === 2))
      return response.status(401).send({ error: 'Token error' });

    try {
      const [scheme, token] = parts;

      if (!/^Bearer$/i.test(scheme))
        return response.status(401).send({ error: 'Token malformatted' });

      jwt.verify(token, authConfig.jwt.secret, (err: any, decoded: any) => {
        if (err) return response.status(401).send({ error: 'Token invalid' });

        request.params.userId = decoded.id;
        return next();
      });
    } catch (error) {
      return response.status(401).json({ error: 'Token invalid' });
    }
  }
}
