// Authentication middleware to fetch user from database
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config').JWT_SECRET;

const fetchUser = async (req, res, next) => {
    try {
        //Get user from JWT and add id to req obj
        const token = req.header('auth-token');
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({
            error: 'You must be logged in to perform this action'
        });
    }
};

module.exports = fetchUser;