const jwt = require('jsonwebtoken');

function auth(req, res, next) {

    const authHeader = req.header('Authorization');


    if (!authHeader) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {

        const tokenParts = authHeader.split(' ');
        if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
            return res.status(401).json({ msg: 'Token is not in the correct "Bearer <token>" format' });
        }
        const token = tokenParts[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

 
        req.user = decoded.user;
        next();
    } catch (e) {
        res.status(400).json({ msg: 'Token is not valid' });
    }
}

module.exports = auth;
