const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');


router.post('/register', authController.register);
router.post('/login',  authController.login);
router.post('/initiate-reset-password',  authController.initiateResetPassword);
router.post('/verify-reset-password',  authController.verifyResetPassword);
router.post('/reset-password',  authController.resetPassword);
router.get('/google',  authController.googleAuth);
router.get('/google/callback',  authController.googleAuthCallback);
// router.post('/reset-password',  authController.resetPassword);

module.exports = router;
