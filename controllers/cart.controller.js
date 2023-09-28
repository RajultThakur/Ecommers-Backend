const { Cart, ProductStatus } = require("../models/cart");
const { updateOne } = require("../models/product");
const Product = require("../models/product")
const User = require("../models/user")

const addToCartOrWishList = async (req, res) => {
    let { authorId, productId, category } = req.body;

    try {
        const isValid = authorId || productId || category;

        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: "all fields required"
            })
        }

        let product = await Cart.findOne({ author: authorId, product: productId });

        if (product) {
            let _id = product._id;
            let quantity = product.quantity;

            if (category === ProductStatus.WISH_LISTED) {

                if (product.category === ProductStatus.ADDED_TO_CART) {
                    // category = ProductStatus.CART_AND_LISTED;
                    const updatedCart = await Cart.findByIdAndUpdate({ _id }, { $set: { quantity, category: ProductStatus.CART_AND_LISTED } });

                    return res.status(201).json({
                        success: true,
                        data: category
                    })
                } else if (product.category === ProductStatus.CART_AND_LISTED) {
                    const updatedCart = await Cart.findByIdAndUpdate({ _id }, { $set: { quantity, category: ProductStatus.ADDED_TO_CART } });

                    return res.status(201).json({
                        success: true,
                        data: 'removed form wishlist not form cart'
                    })
                }
                else if (product.category === ProductStatus.WISH_LISTED) {
                    await Cart.findByIdAndRemove(_id);
                    return res.status(201).json({
                        success: true,
                        message: "removed form wishlist"
                    })
                }
            } else {
                if (product.category === ProductStatus.WISH_LISTED) {
                    category = ProductStatus.CART_AND_LISTED;
                }
                quantity++;
                const updatedCart = await Cart.findByIdAndUpdate({ _id }, { $set: { quantity, category: category } });

                return res.status(201).json({
                    success: true,
                    data: category
                })
            }
        }

        const cartObj = new Cart({
            author: authorId,
            product: productId,
            category,
            quantity: category === ProductStatus.WISH_LISTED ? 0 : 1
        })

        const addedProduct = await cartObj.save();

        return res.json({
            success: true,
            message: category,
            data: addedProduct

        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getCartProduct = async (req, res) => {
    const { id } = req.params;

    try {
        let cartItems = Cart.find({ author: id, })

        // cartItems = Cart.find({ $or: [{ category: "added to cart" }, { category: "in cart as well as wish listed" }] });
        // const data = await cartItems
        const data = await cartItems.populate([{
            path: "product",
            model: "Product",
            select: ["-seller", "-stock", "-category"]
        }]);

        return res.status(201).json({
            success: true,
            data
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

const removeFromCart = async (req, res) => {
    const { id } = req.params;

    try {
        const cartItems = await Cart.findById(id);

        let query;
        const quantity = cartItems.quantity
        if (quantity > 1) {
            query = Cart.findByIdAndUpdate(id, { $set: { quantity: quantity - 1 } })
        } else {
            if (cartItems.category === ProductStatus.WISH_LISTED || cartItems.category === ProductStatus.CART_AND_LISTED) {
                query = Cart.findByIdAndUpdate(id, { $set: { category: ProductStatus.WISH_LISTED, quantity: 0 } })
            } else {
                query = Cart.findByIdAndDelete(id);
            }
        }

        await query;

        return res.status(201).json({
            success: true,
            message: "item removed from cart"
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

module.exports = { addToCartOrWishList, getCartProduct, removeFromCart };