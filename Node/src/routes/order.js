const express = require('express');
const { createOrder, fetchOrder, fetchOrders, updateStatus, deleteOrder } = require('../controller/order');

const router = express.Router();
router.post('/create', createOrder);
router.get('/fetch/:order_id', fetchOrder);
router.get('/fetch-all/:email', fetchOrders);
router.delete('/delete/:order_id', deleteOrder);

exports.routes = router;