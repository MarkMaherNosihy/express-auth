const { verifyToken } = require('../utils/jwt');
const prisma = require('../prisma/client');

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Missing or invalid token' });
  }

  try {
    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: parseInt(decoded.userId) } });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: 'Token verification failed' });
  }
};

module.exports = authMiddleware;
