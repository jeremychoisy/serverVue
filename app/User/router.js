const controller = require('./controller');
const express = require('express');
const router = express.Router();

router.post('/sign-up', controller.signUp);
router.post('/log-in', controller.logIn);

module.exports = router;
