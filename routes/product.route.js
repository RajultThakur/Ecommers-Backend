const express = require('express')
const {listProduct, getProducts, getProductById} = require("../controllers/product.controller");
const Auth = require("../middleware/auth")

const router = express.Router();

router.get("/products", getProducts);
router.get("/:id", getProductById);
router.post("/list", Auth, listProduct);

module.exports = router;