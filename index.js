require('dotenv').config();
const connect = require('./utils/db.js')();
const express = require('express');
const app = express();
const cors = require('cors');
const userRouter = require('./routes/user.route');
const productRouter = require('./routes/product.route');
const orderRouter = require('./routes/order.route')
const productJson = require('./data/product.data.json');
const Product = require('./models/product');
const adminRouter = require('./routes/admin.route')
const cartRouter = require('./routes/cart.route');
const checkoutRouter = require("./routes/checkout.route")
const bodyParser = require('body-parser')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Order } = require("./models/order")


app.use(cors());

async function getCartItems (line_items) {
    return new Promise((resolve, reject) => {
        let cartItems = [];

        line_items.data.forEach(async (item) => {
            const product = await stripe.products.retrieve(item.price.product);
            console.log("product is : ", product)
            const productId = product.metadata.productId;
            console.log(product.images)
            cartItems.push({
                product: productId,
                name: product.name,
                price: item.price.unit_amount_decimal / 100,
                quantity: item.quantity,
            });

            if (cartItems.length === line_items?.data.length) {
                resolve(cartItems);
            }
        });
    });
}

app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (request, response) => {
    const payload = request.body;
    // console.log('payload is : ', payload)
    const sig = request.headers['stripe-signature'];

    let event;
    console.log('going goin')
    try {
        event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);
        // console.log("event is : ", event)
    } catch (err) {
        console.log(err.message)
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        // console.log("session : ", session)
        const line_items = await stripe.checkout.sessions.listLineItems(
            event.data.object.id
        );
        // console.log("line_items : ", line_items)

        const orderItems = await getCartItems(line_items);
        const userId = session.client_reference_id;
        const amountPaid = session.amount_total / 100;

        const paymentInfo = {
            id: session.payment_intent,
            status: session.payment_status,
            amountPaid,
            taxPaid: session.total_details.amount_tax / 100,
        };

        const orderData = new Order({
            user: userId,
            shippingInfo: session.metadata.shippingInfo,
            paymentInfo,
            orderItems,
        });

        const order = await orderData.save();
        console.log("order created")
        return response.status(201).json({ success: true });
    }

    response.status(401).json({ success: false });

});
// app.use('/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

app.use('/user', userRouter);
app.use('/product', productRouter);
app.use('/cart', cartRouter);
app.use('/order', orderRouter);
app.use('/admin', adminRouter)
app.use('', checkoutRouter)

//if you want to insert multiple product just comment it out and update product.data.json file.

// Product.insertMany(productJson);
// Product.deleteMany();

app.listen(process.env.PORT, () => {
    console.log(`application is running on port ${process.env.PORT}`);
})