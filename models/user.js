const mongoose = require('mongoose');

const Role = {
    ADMIN: 'admin',
    USER: 'user',
    SELLER: 'seller'
}

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "please provide a username"],
        },

        email: {
            type: String,
            required: [true, " please provide a email"],
            unique: true
        },

        password: {
            type: String,
            required: [true, "please provide a password"]
        },

        address: [{type: String}],

        role: {
            type: String,
            enm: Role,
            default: Role.USER
        },
    },
    {
        timestamps: true
    },
)
const User = mongoose.model('User',UserSchema);
module.exports = {User,Role};

