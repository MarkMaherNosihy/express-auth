const authService = require('../services/auth.service');

exports.register = async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json(result);
};

exports.login = async (req, res) => {
  try{
    const result = await authService.login(req.body);
    res.status(200).json(result);
  }catch(error){
    if(error.message === 'Invalid credentials'){
      res.status(401).json({message: error.message});
    }else{
      res.status(500).json({message: error.message});
    }
  }

};
