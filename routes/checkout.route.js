const express = require('express');
const { makePayment } = require('../controllers/checkout.controller');

const router = express.Router();

router.post('/create-checkout-session', makePayment);

module.exports = router;