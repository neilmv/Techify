import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res
      .status(403)
      .json({ message: "Access denied, no token provided" });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  if (!token) {
    return res
      .status(403)
      .json({ message: "Access denied, no token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Token verification error:", err);
      return res.status(401).json({ message: "Invalid token" });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role || 0; // Default to user role
    next();
  });
};

// Admin-only middleware
export const requireAdmin = (req, res, next) => {
  if (req.userRole !== 1) {
    return res.status(403).json({ 
      message: "Access denied. Admin privileges required." 
    });
  }
  next();
};

// Combined middleware for admin routes
export const verifyAdmin = [verifyToken, requireAdmin];