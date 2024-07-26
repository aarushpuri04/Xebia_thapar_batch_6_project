import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {

const authHeader = req.headers['authorization'];
const token = authHeader && authHeader.split(' ')[1];

if (!token) {
  console.log('No token provided');
  return res.sendStatus(401); // No token provided
}

jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
  if (err) {
    console.log('token',token);
    console.error('Invalid token:', err);
    return res.sendStatus(403); // Invalid token
  }

  console.log('Token verified:', decoded);
  req.user = decoded; // Assuming decoded contains user information
  next();
  });

  
};

export default authenticateToken;
