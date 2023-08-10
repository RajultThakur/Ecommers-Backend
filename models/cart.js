const mongoose = require('mongoose');

const ProductStatus = {
    ADDED_TO_CART : "added to cart",
    WISH_LISTED : "wish listed",
    CART_AND_LISTED : "in cart as well as wish listed"
}

const CartSchema = new mongoose.Schema(
    {
        author : {
            type : mongoose.Types.ObjectId,
            ref : 'User'
        },

        product :{
            type : mongoose.Types.ObjectId,
            ref : 'Product'
        },

        category : {
            type : String,
            enm : ProductStatus,
            default : ProductStatus.ADDED_TO_CART 
        },

        quantity : {
            type : Number,
            default : 1
        }
    },
    {
        timestamps: true
    },
)
const Cart = mongoose.model('Cart',CartSchema);
module.exports = {Cart, ProductStatus};

