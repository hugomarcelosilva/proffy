import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

import db from '../database/connection';

export default class ProfilesController {
  async update(request: Request, response: Response) {
    const { id } = request.params;

    const user = await db('users').select().where({ id });

    if (!user[0]) {
      return response.status(404).json({ error: 'User not found' });
    }

    const { name, whatsapp, bio, subject, cost } = request.body;

    const trx = await db.transaction();

    try {
      await trx('users').where({ id }).update({
        name,
        whatsapp,
        bio,
      });

      await trx('classes').where({ user_id: id }).update({
        subject,
        cost,
      });

      await trx.commit();

      const updatedUser = await db('users').select().where({ id });

      return response.status(200).json(updatedUser[0]);
    } catch (error) {
      await trx.rollback();

      return response.status(400).json({
        error: 'Unexpected error while updating profile',
      });
    }
  }

  async updateAvatar(request: Request, response: Response) {
    const { id } = request.params;

    const user = await db('users').select().where({ id });

    if (!user[0]) {
      return response.status(404).json({ error: 'User not found' });
    }

    await db('users').where({ id }).update({
      avatar: request.file.filename,
    });

    if (user[0].avatar) {
      const file = path.resolve(
        __dirname,
        '..',
        '..',
        'uploads',
        user[0].avatar,
      );

      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    }

    const updatedUser = await db('users').select().where({ id });

    return response.status(200).json(updatedUser[0]);
  }
}
