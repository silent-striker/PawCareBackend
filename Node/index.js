/* external */
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
// const cors = require('cors');
const app = express();

const bodyParser = require('body-parser')
/* controller */
const { processPayment } = require('./src/controller/payment')
const paymentRouter = require('./src/routes/payment')
const chatRouter = require('./src/routes/chat')
const orderRouter = require('./src/routes/order')

/* middleware */
const corsMiddleware = require('./src/middleware/corsMiddleware');

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('connected to db');
}).catch((err) => {
  console.log(err);
})

app.use(corsMiddleware);
app.post('/webhook', express.raw({ type: 'application/json' }), processPayment);

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));

app.use('/api', paymentRouter.routes)
app.use('/chat', chatRouter.routes)
app.use('/order', orderRouter.routes)

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`server started @ ${port}`)
})
