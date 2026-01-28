import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { JWT_SECRET } from "../config.js";

/**
 * AUTHENTICATION MIDDLEWARE
 * Verifies JWT tokens and attaches user data to the request object
 *
 * This middleware:
 * 1. Extracts the Bearer token from the Authorization header
 * 2. Verifies the token signature using JWT_SECRET
 * 3. Fetches the user from database using the decoded user ID
 * 4. Attaches user data to req.user for use in route handlers
 */
export const authenticate = async (req, res, next) => {
  try {
    // Extract token from Authorization header (format: "Bearer <token>")
    const token = req.header("Authorization")?.replace("Bearer ", "");

    // Check if token exists
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    // Verify and decode the JWT token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find user in database using the ID from token
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Token is not valid." });
    }

    // Attach authenticated user to request object for use in next middleware/route
    req.user = user;
    next();
  } catch (error) {
    // Token verification failed or invalid
    res.status(401).json({ message: "Token is not valid." });
  }
};

/**
 * AUTHORIZATION MIDDLEWARE
 * Checks if the authenticated user has the required role(s)
 *
 * This middleware:
 * 1. Verifies user is authenticated (req.user exists)
 * 2. Checks if user's role matches any of the allowed roles
 * 3. Grants access only if role is authorized
 *
 * @param {...string} roles - Allowed roles (e.g., 'admin', 'user')
 * @returns {Function} Middleware function that checks authorization
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    // Check if user's role is in the list of allowed roles
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
    }

    // User is authorized, proceed to next middleware/route
    next();
  };
};
