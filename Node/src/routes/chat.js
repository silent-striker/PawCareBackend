const express = require('express');
const router = express.Router();
const { sendMessage } = require('../controller/dialogflow');

router.post('/send-message', sendMessage);

exports.routes = router;