const express = require('express');
const { signIn, signup, getUserByID, getUserByToken } = require('../controllers/user.controller');
const Auth = require('../middleware/auth');

const router = express.Router();
router.post('/signup', signup);
router.post('/signin', signIn);
router.get('/:id', Auth, getUserByID);
router.get('/', Auth, getUserByToken);

module.exports = router;