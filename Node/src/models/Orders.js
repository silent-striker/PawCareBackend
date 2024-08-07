const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const orderSchema = new Schema({
    customer_id: {
        type: String,
        required: true
    },
    customer_name: {
        type: String,
        required: true
    },
    order_id: {
        type: String,
        required: true
    },
    created: {
        type: Number,
        default: Date.now()
    },
    amount_due: {
        type: Number,
        required: true
    },
    amount_paid: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'cad'
    },
    status: {
        type: String,
        default: 'pending'
    },
    transaction_id: {
        type: String,
        default: ''
    },
    product_details: {
        type: Array,
        default: []
    }
});

const Orders = model('orders', orderSchema);
module.exports = Orders;