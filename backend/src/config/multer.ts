import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

export default {
  dest: path.resolve(__dirname, '..', '..', 'uploads'),
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(__dirname, '..', '..', 'uploads'));
    },
    filename: function (req, file, cb) {
      const filehash = crypto.randomBytes(16).toString('hex');

      cb(null, `${filehash}-${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  filefilter: function (req: any, file: any, cb: any) {
    const allowedMimes = [
      'image/jpeg',
      'image/pjpeg',
      'image/png',
      'image/gif',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type.'));
    }
  },
};
