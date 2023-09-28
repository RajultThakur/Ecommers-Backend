const express = require('express');
const { makePayment, webhook } = require('../controllers/checkout.controller');
const bodyParser = require('body-parser');
const router = express.Router();

router.post('/create-checkout-session', makePayment);
// router.post('/webhook', bodyParser.raw({ type: 'application/json' }), webhook);

module.exports = router;