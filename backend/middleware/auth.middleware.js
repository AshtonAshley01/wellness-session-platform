const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    // Get token from Authorization header
    const authHeader = req.header('Authorization');

    // Check if no auth header
    if (!authHeader) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Check if the header format is "Bearer <token>"
        const tokenParts = authHeader.split(' ');
        if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
            return res.status(401).json({ msg: 'Token is not in the correct "Bearer <token>" format' });
        }
        const token = tokenParts[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add user from payload to the request object
        req.user = decoded.user;
        next();
    } catch (e) {
        res.status(400).json({ msg: 'Token is not valid' });
    }
}

module.exports = auth;
