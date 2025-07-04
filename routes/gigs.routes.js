const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const authorizationMiddleware = require('../middlewares/authorize.middleware');
const router = express.Router();

const gigsController = require('../controllers/gigs.controller');

router.post('/', authMiddleware,authorizationMiddleware(['ADMIN', 'WORKER']), gigsController.createGig);
router.get('/', authMiddleware, authorizationMiddleware(['ADMIN', 'WORKER']), gigsController.getGigs);

module.exports = router;


