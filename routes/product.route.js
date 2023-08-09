const express = require('express')
const {listProduct, getProducts} = require("../controllers/product.controller");
const Auth = require("../middlewere/auth")

const router = express.Router();

router.get("/products", getProducts);
router.post("/list", Auth, listProduct);

module.exports = router;