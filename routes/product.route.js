const express = require('express')
const {listProduct, getProducts, getProductById, addProduct, deleteProduct} = require("../controllers/product.controller");
const Auth = require("../middleware/auth")

const router = express.Router();

router.get("/products", getProducts);
router.get("/:id", getProductById);
router.post("/list", Auth, listProduct);
router.post("/addproduct", Auth, addProduct)
router.delete("/delete/:id", Auth, deleteProduct)

module.exports = router;