const express = require('express');
const { makeAdminOrRemoveAdmin, getAllAdmins } = require('../controllers/admin.controller');
const Auth = require('../middleware/auth');

const router = express.Router();

router.post('/update', Auth, makeAdminOrRemoveAdmin);
router.get('/all', Auth, getAllAdmins);

module.exports = router;