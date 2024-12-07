import createHttpError from 'http-errors';
import { ROLES } from '../constans/constans.js';

export const checkRoles = (...roles) => {
  return async (req, res, next) => {
    const { user } = req;

    if (!user) {
      next(createHttpError(401, 'User not found'));
      return;
    }

    const { role } = user;

    if (roles.includes(ROLES.ADMIN) && role === ROLES.ADMIN) {
      next();
      return;
    }

    if (roles.includes(ROLES.USER) && role === ROLES.USER) {
      next();
      return;
    }
    next(createHttpError(403));
  };
};
