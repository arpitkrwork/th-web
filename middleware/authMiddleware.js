const { verifyToken } = require('../utils/jwtUtils'); // Import verifyToken function

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization'); // Get Authorization header

  // Check if the Authorization header is present
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized: No Authorization header provided' });
  }

  // Ensure the token follows the Bearer format
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Unauthorized: Invalid token format. Expected Bearer token.' });
  }

  const token = parts[1]; // Extract the token part

  // Verify the token
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }

  req.user = decoded; // Attach user data to the request object
  next(); // Proceed to the next middleware or route
};

module.exports = authMiddleware;
