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

app.use(express.json());
app.use(cors());

app.use('/user', userRouter);
app.use('/product', productRouter);
app.use('/cart', cartRouter);
app.use('/order', orderRouter);
app.use('/admin', adminRouter)
app.use('/stripe', checkoutRouter)

//if you want to insert multiple product just comment it out and update product.data.json file.

// Product.insertMany(productJson);
// Product.deleteMany();

app.listen(process.env.PORT, () => {
    console.log(`application is running on port ${process.env.PORT}`);
})