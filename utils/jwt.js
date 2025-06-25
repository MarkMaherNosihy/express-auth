const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'; // Use env in production
const JWT_EXPIRES_IN = '1d'; // or from env

exports.signToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
