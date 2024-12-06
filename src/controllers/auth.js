import { registrationUser } from '../services/auth.js';

export const registrationUserController = async (req, res) => {
  const user = await registrationUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Seccessfully registered a user',
    data: user,
  });
};
