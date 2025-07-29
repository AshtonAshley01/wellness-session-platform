import jwt from 'jsonwebtoken';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret'); // Use the same secret as above
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

export default authMiddleware;
