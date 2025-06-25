const prisma = require('../prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt');

exports.register = async ({ email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  });
  return { user };
};

exports.login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = jwt.signToken({ userId: user.id });
  return { token };
};
