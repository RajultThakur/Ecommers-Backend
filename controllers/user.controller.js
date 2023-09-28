const User = require('../models/user.js').User;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// user signup function. 
const signup = async (req, res) => {
    const { email, name, password } = req.body;

    let success = false;
    try {

        if (!name || !email || !password)
            return res.status(400).json({
                success,
                message: "all fields required"
            })

        const oldUser = await User.findOne({ email });

        if (oldUser)
            return res.status(422).json({
                success,
                message: "user already exist"
            });

        const encryptPass = await bcrypt.hash(password, 8);

        const user = new User({
            name,
            email,
            password: encryptPass
        });

        await user.save();

        success = true;
        res.status(201).json({
            success,
            data: user
        });

    } catch (error) {
        return res.status(500).json({
            success,
            error: error.message
        });
    }
};

//user login function using JWT authentication.
const signIn = async (req, res) => {
    const { email, password } = req.body;
    let success = false;
    try {

        if (!email || !password)
            return res.status(400).json({
                success,
                message: "all fields required"
            })

        const user = await User.findOne({ email });

        if (!user)
            return res.status(422).json({
                success,
                message: "first signup"
            })

        const hashPass = await bcrypt.compare(password, user.password);

        if (!hashPass)
            return res.json({
                success,
                message: "invalid details"
            });

        const token = jwt.sign({
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role
        }, process.env.SECRET_KEY);

        success = true;

        return res.status(201).json({
            success,
            token
        });

    } catch (error) {
        return res.status(500).json({
            error
        });
    }
};

// getting single user based on user _id.
// this is also a protected route you can not call it without logged in.
const getUserByID = async (req, res) => {
    let success = true;
    const { id } = req.params;

    try {

        const user = await User.findById(id).select("-password")

        return res.status(201).json({
            success,
            data: user
        })

    } catch (error) {
        return res.status(500).json({
            error
        })
    }
};

const getUserByToken = async (req, res) => {
    return res.status(201).json({
        success: true,
        data: req.userData
    })
}

module.exports = { signup, signIn, getUserByID, getUserByToken };

