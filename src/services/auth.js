import createHttpError from 'http-errors';
import { User } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { Session } from '../db/models/session.js';
import { FIFTEN_MINUTES, THIRTY_DAY } from '../constans/constans.js';

export const registrationUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });

  console.log(user);

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
