const prisma = require('../prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt');
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.register = async ({ email, password }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error('User already exists');
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  });
  return { user };
};

exports.login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');
  if(!user.password) throw new Error('Invalid credentials');
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = jwt.signToken({ userId: user.id });
  return { token };
};


exports.initiateResetPassword = async ({ email }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await prisma.user.update({
    where: { id: user.id },
    data: { resetOtp: otp, resetOtpExpiresAt: new Date(Date.now() + 10 * 60 * 1000) },
  });

  // send email to user with otp
  const msg = {
    to: email, // Change to your recipient
    from: 'triplekill159@gmail.com', // Change to your verified sender
    subject: 'Reset Password OTP',
    text: `Your reset password OTP is ${otp}`,
    html: `<strong>Your reset password OTP is ${otp}</strong>`,
  }
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
  return { otp };
}

exports.verifyResetPassword = async ({ email, otp }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');
  if (user.resetOtp !== otp.toString()) throw new Error('Invalid OTP');
  return { message: 'OTP verified' };
}


exports.resetpassword = async ({ email, password, otp }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');
  if (user.resetOtp !== otp) throw new Error('Invalid OTP');
  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });
  await prisma.user.update({
    where: { id: user.id },
    data: { resetOtp: null, resetOtpExpiresAt: null },
  });
  return { message: 'Password reset successfully' };
}

exports.upsertUser = async (user) => {
  const res = await prisma.user.upsert({
    where: { email: user.email },
    update: {
      googleId: user.id,
    },
    create: {
      email: user.email,
      name: user.name,
      profileImage: user.picture,
      googleId: user.id,
    },
  })
  return { message: 'User upserted successfully', user };
}