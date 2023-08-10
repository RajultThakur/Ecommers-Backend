const express = require('express');
const { signin, signup, getUserByID } = require('../controllers/user.controller');
const Auth = require('../middleware/auth');

const router = express.Router();
router.post('/signup', signup);
router.post('/signin', signin);
router.get('/:id', Auth, getUserByID);

module.exports = router;