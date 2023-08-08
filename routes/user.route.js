const express = require('express');
const { signin, signup, getUserByID } = require('../controllers/user.controller');
const Auth = require('../middlewere/auth');

const router = express.Router();
router.route('/signup').post(signup);
router.route('/signin').post(signin);
router.route('/:id').get(Auth, getUserByID);

module.exports = router;