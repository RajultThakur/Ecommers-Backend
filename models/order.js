const mongoose = require('mongoose');

const OrderStatus = {
    SHIPPED : 'Shipped',
    CANCEL : 'Cancel',
    RETURN : 'Return',
    SUCCESS : 'Delivered'
}

const OrderSchema = new mongoose.Schema(
    {
        author : {
            type : mongoose.Types.ObjectId,
            ref : 'User'
        },
        product :{
            type : mongoose.Types.ObjectId,
            ref : 'Product'
        },
        status : {
            type : String,
            enm : OrderStatus,
            default : OrderStatus.SHIPPED
        },
        Date:{
            type:Date,
            default:Date.now
        },
    },
    {
        timestamps: true
    },
)
const Order = mongoose.model('Order',OrderSchema);
module.exports = {Order, OrderStatus};

