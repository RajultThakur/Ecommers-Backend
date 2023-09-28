const mongoose = require('mongoose');

const OrderStatus = {
    SHIPPED: 'Shipped',
    CANCEL: 'Cancel',
    RETURN: 'Return',
    SUCCESS: 'Delivered'
}

const OrderSchema = mongoose.Schema({
    shippingInfo: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    orderItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "Product",
            },
            name: {
                type: String,
                required: true,
            },
            quantity: {
                type: String,
                required: true,
            },
            image: [{
                type: String,
            }],
            price: {
                type: String,
                required: true,
            },
        },
    ],
    paymentInfo: {
        id: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        taxPaid: {
            type: Number,
            required: true,
        },
        amountPaid: {
            type: Number,
            required: true,
        },
    },
    orderStatus: {
        type: String,
        default: "Processing",
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
});

const Order = mongoose.model('Order', OrderSchema);
module.exports = { Order, OrderStatus };

