import createHttpError from 'http-errors';
import { User } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { Session } from '../db/models/session.js';
import {
  FIFTEN_MINUTES,
  SMTP,
  TEMPLATE_DIR,
  THIRTY_DAY,
} from '../constans/constans.js';
import jwt from 'jsonwebtoken';
import { env } from '../utils/env.js';
import path from 'path';
import * as fs from 'fs/promises';
import handlebars from 'handlebars';
import { sendEmail } from '../utils/sendEmail.js';

export const registrationUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });

  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await User.create({ ...payload, password: encryptedPassword });
};

export const loginUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });

  if (!user)
    throw createHttpError(
      401,
      'Authentication failed. Please check your credentials',
    );

  const isPasswordMatch = await bcrypt.compare(payload.password, user.password);

  if (!isPasswordMatch)
    throw createHttpError(
      401,
      'Authentication failed. Please check your credentials',
    );

  await Session.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAY),
  });
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAY),
  };
};

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await Session.findOne({
    _id: sessionId,
    refreshToken: refreshToken,
  });

  if (!session) throw createHttpError(401, 'Session not found');

  const isSessionTokenEpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenEpired) throw createHttpError(401, 'Session token expired');

  const newSession = createSession();

  await Session.deleteOne({ _id: sessionId, refreshToken: refreshToken });

  return await Session.create({ userId: session.userId, ...newSession });
};

export const logoutUser = async (sessionId, refreshToken) => {
  await Session.deleteOne({ _id: sessionId, refreshToken: refreshToken });
};

export const requestResetEmail = async (email) => {
  const user = await User.findOne({ email });

  if (!user) throw createHttpError(404, 'User not found');

  const resetToken = jwt.sign({ sub: user._id, email }, env('JWT_SECRET'), {
    expiresIn: '5m',
  });

  const resetPasswordTemplatePath = path.join(
    TEMPLATE_DIR,
    'reset-password-emai.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  await sendEmail({
    from: env(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset you password',
    html,
  });
};
