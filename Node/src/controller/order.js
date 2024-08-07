const Orders = require('../models/Orders.js');
const Users = require('../models/Users.js');
const { v4: uuidv4 } = require('uuid');

// create order
const createOrder = async (req, res) => {
    const { email, amount_due, amount_paid, currency, payment_status, transaction_id, product_details } = req.body;

    try {
        // fetch user details by email
        const userDoc = await Users.findOne({ email: email }, '_id username').exec();
        if (!userDoc) {
            return res.status(400).json({ error: 'User not found' });
        }

        // create order
        const order_id = uuidv4();
        const response = await Orders.create({
            customer_id: userDoc._id.toString(),
            customer_name: userDoc.username,
            order_id: order_id,
            amount_due: amount_due,
            amount_paid: amount_paid,
            currency: currency,
            status: payment_status,
            transaction_id: transaction_id,
            product_details: product_details
        });
        // check for errors
        if (response.errors) {
            return res.status(400).json({ error: 'Error creating order' });
        }

        // successful order creation
        res.status(201).json({
            status: 'success',
            order_id: response.order_id
        });
    } catch (err) {
        console.error("Error in createOrder: ", err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// fetch a particular order
const fetchOrder = async (req, res) => {
    const { order_id } = req.params;
    try {
        const orderDoc = await Orders.findOne({ order_id: order_id }).exec();
        if (!orderDoc) {
            return res.status(400).json({ error: 'Order not found' });
        }

        res.status(200).json({
            status: 'success',
            order: orderDoc
        });
    } catch (err) {
        console.error("Error in fetchOrder: ", err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// fetch all orders of customer
const fetchOrders = async (req, res) => {
    const { email } = req.params;
    try {
        // fetch user id
        const userDoc = await Users.findOne({ email: email }, '_id').exec();
        const userId = userDoc._id.toString();

        // fetch orders by user id
        const orderDocs = await Orders.find({ customer_id: userId }, { _id: 0 }).exec();
        if (!orderDocs) {
            return res.status(400).json({ error: 'Orders not found' });
        }

        res.status(200).json({
            status: 'success',
            orders: orderDocs
        });
    } catch (err) {
        console.error("Error in fetchOrders: ", err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// update order information
const updateOrder = async (req) => {
    const { order_id, status, transaction_id } = req;
    try {
        const orderDoc = await Orders.findOneAndUpdate({ order_id: order_id }, { $set: { status: status, transaction_id: transaction_id } }, { new: true }).exec();
        if (!orderDoc) {
            return {
                status: 'failed',
                message: 'Order not found'
            }
        }

        return {
            status: 'success',
            order: orderDoc
        };
    } catch (err) {
        console.error("Error in updateOrder: ", err);
        return { message: 'Internal server error' };
    }
}

// delete order
const deleteOrder = async (req, res) => {
    const { order_id } = req.params;
    try {
        const orderDoc = await Orders.findOne({ order_id: order_id }).exec();
        if (!orderDoc) {
            return res.status(400).json({ error: 'Order not found' });
        }

        await Orders.deleteOne({ order_id: order_id }).exec();
        res.status(200).json({
            status: 'success',
            message: 'Order deleted successfully'
        });
    } catch (err) {
        console.error("Error in deleteOrder: ", err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { createOrder, fetchOrder, fetchOrders, updateOrder, deleteOrder };