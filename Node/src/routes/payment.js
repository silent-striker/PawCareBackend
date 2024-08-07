const express = require('express')
const router = express.Router()
const { initPayment } = require('../controller/payment')

router.post('/create-checkout-session', initPayment);

exports.routes = router;
