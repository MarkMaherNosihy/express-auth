const authService = require('../services/auth.service');
const oauth = require('../utils/oauth');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try{
    const result = await authService.register(req.body);
    res.status(201).json(result);
  }catch(error){
    if(error.message === 'User already exists'){
      res.status(400).json({message: error.message});
    }
  }
};

exports.login = async (req, res) => {
  try{
    const result = await authService.login(req.body);
    // Set the token as a cookie
    res.cookie('token', result.token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 24 * 60 * 60 * 1000 
    });
    res.status(200).json(result);
  }catch(error){
    if(error.message === 'Invalid credentials'){
      res.status(401).json({message: error.message});
    }else{
      res.status(500).json({message: error.message});
    }
  }

};

exports.initiateResetPassword = async (req, res) => {
  try{
    const result = await authService.initiateResetPassword(req.body);
    res.status(200).json(result);
  }catch(error){
    if(error.message === 'User not found'){
      res.status(404).json({message: error.message});
    }else{
      res.status(500).json({message: error.message});
    }
  }
}

exports.verifyResetPassword = async (req, res) => {
  try{
    const result = await authService.verifyResetPassword(req.body);
    res.status(200).json(result);
  }catch(error){
    if(error.message === 'Invalid OTP'){
      res.status(401).json({message: error.message});
    }else{
      res.status(500).json({message: error.message});
    }
  }
}


exports.getUser = async (req, res) => {
  const user = req.user;
  res.status(200).json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    profileImage: user.profileImage,
    isEmailVerified: user.isEmailVerified,
    onboardingCompleted: user.onboardingCompleted,
    googleId: user.googleId
  });
}

exports.logout = async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
}

exports.resetPassword = async (req, res) => {
  try{
    const result = await authService.resetpassword(req.body);
    res.status(200).json(result);
  }catch(error){
    res.status(500).json({message: error.message});
  }
}

exports.googleAuth = async (req, res) => {
  const url = oauth.getGoogleOAuthURL();
  res.redirect(url);
}


exports.googleAuthCallback = async (req, res) => {
  const { code } = req.query;
  const result = await oauth.getGoogleUser(code);
  //upsert user
  const {user} = await authService.upsertUser(result);
  //generate token
  console.log("User is", user);
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
  res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 });
  console.log(process.env.FRONTEND_URL);
  console.log("Cookie is set");
  res.redirect(`${process.env.FRONTEND_URL}`);
  console.log("Redirecting to frontend");
}
