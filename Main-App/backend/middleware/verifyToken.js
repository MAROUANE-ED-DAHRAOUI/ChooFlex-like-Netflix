const jwt = require('jsonwebtoken');
const router = require('express').Router();

// JWT verification middleware
const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ error: 'Access token required' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ error: 'Token expired' });
                }
                return res.status(403).json({ error: 'Invalid token' });
            }
            req.user = decoded; // Add user data to request object
            next();
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = verifyToken;
