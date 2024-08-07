require('dotenv').config();
const stripe = require('stripe')(process.env.SECRET_KEY);
const { updateOrder } = require('./order');

exports.initPayment = async (req, res) => {
  const { product, order_id } = req.body;

  const lineItems = product.map((products) => {
    return {
      price_data: {
        currency: "cad",
        product_data: {
          name: products.title,
          description: products.description
        },
        unit_amount: Math.round(products.amount * 100),
      },
      quantity: 1
    };
  });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/payment-success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-failure`,
      metadata: {
        order_id: order_id
      }
    });

    res.json({ session });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    res.status(500).json({ error: 'Failed to create Stripe checkout session' });
  }
};

exports.processPayment = async (req, res) => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, secret);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const order_id = session.metadata.order_id;
      let status = session.payment_status === 'paid' ? 'success' : 'failed';
      const transaction_id = session.payment_intent;
      console.log("completed session: ", session);

      // Process successful payment
      const request = {
        order_id: order_id,
        status: status,
        transaction_id: transaction_id
      };

      await updateOrder(request);
      break;

    case 'checkout.session.expired':
      const expiredSession = event.data.object;
      const expiredOrderId = expiredSession.metadata.order_id;
      const expiredTransactionId = expiredSession.payment_intent;
      console.log('expired session: ', expiredSession);
      // Process failed payment

      const expiredRequest = {
        order_id: expiredOrderId,
        status: 'failed',
        transaction_id: expiredTransactionId
      };

      await updateOrder(expiredRequest);
      break;

    // case ''

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}