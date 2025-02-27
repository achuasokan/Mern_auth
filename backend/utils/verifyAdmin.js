import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';


export const verifyAdmin = (req, res, next) => {
  const token = req.cookies.access_token;
  console.log("Token received:", token); // Log the token
  if (!token) return next(errorHandler(401, 'You are not authenticated!'));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
          console.log("Token verification error:", err); // Log the error
          return next(errorHandler(403, 'Token is not valid!'));
      }

      if (user.role !== 'admin') {
          return next(errorHandler(403, 'You are not authorized!'));
      }

      req.user = user;
      next();
  });
};


