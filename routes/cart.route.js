const express = require('express');
const Auth = require("../middleware/auth"); 
const {addToCartOrWishList, getCartProduct, removeFromCart} = require("../controllers/cart.controller")
const router = express.Router();

router.post("/cartorlist", addToCartOrWishList);
router.get("/cartitems/:id", getCartProduct);
router.get("/remove/:user/:id", removeFromCart);

module.exports = router;