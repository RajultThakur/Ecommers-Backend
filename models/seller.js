const mongoose = require('mongoose');

const SellerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },

    },
    {
        timestamps: true
    },
)

module.exports = mongoose.model('Seller', SellerSchema);

