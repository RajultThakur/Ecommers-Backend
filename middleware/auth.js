const jwt = require('jsonwebtoken');

const Auth = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) res.status(401).json("please verify using valid token")
    try {
        const data = jwt.verify(token, process.env.SECRET_KEY)
        req.userData = data;
        next();
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
}
module.exports = Auth;


