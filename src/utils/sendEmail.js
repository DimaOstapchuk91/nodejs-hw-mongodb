import nodemailer from 'nodemailer';
import { env } from './env.js';
import { SMTP } from '../constans/constans.js';
import createHttpError from 'http-errors';

const transporter = nodemailer.createTransport({
  host: env(SMTP.SMTP_HOST),
  port: Number(env(SMTP.SMTP_PORT)),
  auth: {
    user: env(SMTP.SMTP_USER),
    pass: env(SMTP.SMTP_PASSWORD),
  },
});

export const sendEmail = async (options) => {
  const email = await transporter.sendMail(options);

  if (email.rejected.length !== 0)
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
};
