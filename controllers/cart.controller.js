const { Cart, ProductStatus } = require("../models/cart");
const { updateOne } = require("../models/product");
const Product = require("../models/product")
const User = require("../models/user")

const addToCartOrWishList = async (req, res) => {
    const { authorId, productId, category } = req.body;

    try {
        const isValid = authorId || productId || category;

        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: "all fields required"
            })
        }

        let product = await Cart.findOne({ author : authorId, product : productId });

        if (product) {
            console.log('first')
            let _id = product._id;
            if (product.category === ProductStatus.ADDED_TO_CART) {
                console.log("cart matched")
                let quantity = product.quantity;

                let categoryType = product.category;

                if (category === ProductStatus.WISH_LISTED) {
                    categoryType = ProductStatus.CART_AND_LISTED
                } else {
                    quantity++;
                }

                const updatedCart = await Cart.findByIdAndUpdate({ _id }, { $set: { quantity, category: categoryType } });

                return res.status(201).json({
                    success: true,
                    data: updatedCart
                })
            }
            
            await Cart.findByIdAndRemove(_id);
            return res.status(201).json({
                success: true,
                message: "product removed form wishlist"
            })
        }

        const cartObj = new Cart({
            author: authorId,
            product: productId,
            category,
            quantity : category === ProductStatus.WISH_LISTED ? 0 : 1
        })

        await cartObj.save();

        return res.json({
            success: true,
            data: cartObj
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

const getCartProduct = async(req, res) => {
    const {id} = req.params;

    try {
        const cartItems = await Cart.find({author : id}).populate([{
            path: "author",
            model: "User",
            select: ["name", "email"]
        },{
            path: "product",
            model: "Product",
            select: ["-seller", "-stock", "-category"]
        }]);

        return res.status(201).json({
            success : true,
            data : cartItems
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

const removeFromCart = async(req, res) => {
    const {user, id} = req.params;

    try {
        const cartItems = await Cart.findById(id);

        let query;
        const quantity = cartItems.quantity
        if(quantity > 1){
            query = Cart.findByIdAndUpdate(id,{$set : {quantity : quantity - 1 }})
        }else{
            query = Cart.findByIdAndDelete(id);
        }

        await query;

        return res.status(201).json({
            success : true,
            message : "item removed from cart" 
        })

        
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

module.exports = { addToCartOrWishList, getCartProduct, removeFromCart };