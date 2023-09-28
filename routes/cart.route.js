const express = require('express');
const Auth = require("../middleware/auth");
const { addToCartOrWishList, getCartProduct, removeFromCart } = require("../controllers/cart.controller")
const router = express.Router();

router.post("/cartorlist", addToCartOrWishList);
router.get("/cart-items/:id", getCartProduct);
router.get("/remove/:id", removeFromCart);

module.exports = router;