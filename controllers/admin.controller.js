const { Order, OrderStatus } = require('../models/order');
const { User, Role } = require('../models/user');

const getAllOrders = async (req, res) => {
    const { id } = req.params;

    try {

        const user = await User.findById(id);
        let query;
        if (user.role !== Role.ADMIN) {
            query = Order.find({ author: id });
        } else {
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

const updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    const { orderId } = req.params;
    const { admin } = req.query;
    try {
        const user = await User.findById(admin);

        if (user.role !== Role.ADMIN) {
            return res.status(401).json({
                success: false,
                message: "only admin can change"
            })
        }

        await Order.findByIdAndUpdate({ _id: orderId }, { status: { $set: status } });

        return res.status(201).json({
            success: true,
            message: "status updated!"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

const makeAdminOrRemoveAdmin = async (req, res) => {
    const { email, adminQuery } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: 'user not found'
            })
        }
        if (user.role === 'admin' && adminQuery === 'admin') {
            return res.json({
                success: true,
                message: "already a admin"
            })
        }

        await User.findByIdAndUpdate(user._id, { $set: { role: adminQuery } });

        return res.json({
            success: true,
            message: adminQuery === 'admin' ? "Added to admin" : "removed form admin"
        })

    } catch (error) {

    }
}

const getAllAdmins = async (req, res) => {
    try {
        const allAdmins = await User.find({ role: 'admin' });
        return res.json({
            success: true,
            data: allAdmins,
        })
    } catch (error) {
        return res.json({
            success: false,
            message: "internal server error",
            error: error
        })

    }
}

module.exports = { getAllOrders, updateOrderStatus, makeAdminOrRemoveAdmin, getAllAdmins };