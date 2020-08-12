import nodemailer from 'nodemailer';

const Transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

interface SendEmailData {
  to: {
    name: string;
    address: string;
  };
  subject: string;
  body: string;
}

export default {
  async sendEmail(message: SendEmailData) {
    await Transporter.sendMail({
      from: {
        name: "Proffy's Team",
        address: 'example@example.com',
      },
      to: {
        name: message.to.name,
        address: message.to.address,
      },
      subject: message.subject,
      html: message.body,
    });
  },
};
