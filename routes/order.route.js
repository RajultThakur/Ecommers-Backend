const express = require('express')
const {getAllOrders, updateOrderStatus} = require('../controllers/admin.controller');
const Auth = require('../middleware/auth');

const router = express.Router();

router.get("/orders/:id", getAllOrders);
router.post("/:orderId/update", updateOrderStatus);

module.exports = router;