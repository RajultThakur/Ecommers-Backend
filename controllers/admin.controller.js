const { Order, OrderStatus } = require('../models/order');
const { User, Role } = require('../models/user');

const getAllOrders = async (req, res) => {
    const { id } = req.params;

    try {

        const user = await User.findById(id);
        let query;
        if (user.role !== Role.ADMIN) {
            query = Order.find({author : id});
        }else{
            query = Order.find();
        }

        const orders = await query.populate(
            [
                {
                    path: "author",
                    model: "User",
                    select: ["email", "name"]
                },
                {
                    path: "product",
                    model: "Product",
                    select: ["-author", "-category", "-seller"]
                }
            ]
        )

        return res.status(201).json({
            success: true,
            data: orders
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

const updateOrderStatus = async(req, res) => {
    const {status} = req.body;
    const {orderId} = req.params;
    const {admin} = req.query;
    try {
        const user = await User.findById(admin);

        if (user.role !== Role.ADMIN) {
            return res.status(401).json({
                success: false,
                message: "only admin can change"
            })
        }

        await Order.findByIdAndUpdate({_id : orderId},{status : {$set : status}});

        return res.status(201).json({
            success : true,
            message : "status updated!"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

module.exports = {getAllOrders, updateOrderStatus};