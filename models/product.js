const mongoose = require('mongoose');

const ProductStatus = {
    OUT_OF_STOCK: 'out of stock',
    IN_STOCK: 'Available',
}

const ProductSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'please provide a title'],
        },

        description : {
            type: String,
        },

        img : [{
            type : String,
            required : [true, 'provide at least one image']
        }],

        price: {
            type: Number,
            required: [true, "please provide a price"]
        },

        stock: {
            type: Number,
            required: [true, "please provide a quantity"]
        },

        brand : {
            type : String,
            required : [true, "please provide a brand name"]
        },

        category : [{
            type : String,
            require : [true, 'please provide a category']
        }],

        status: {
            type: String,
            enm: ProductStatus,
            default: ProductStatus.IN_STOCK
        },

        rating : {
            type : Number
        },

        seller : {
            type : mongoose.Types.ObjectId,
            ref : 'Seller'
        }
    },
    {
        timestamps: true
    },
)

module.exports = mongoose.model('Product',ProductSchema);

