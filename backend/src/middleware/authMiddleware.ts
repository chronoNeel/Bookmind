import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../config/firebaseAdmin";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ error: "Token is missing" });
      return;
    }

    const decodedToken = await verifyToken(token);

    if (!decodedToken) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    // Assign typed user to req.user
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ error: "Authentication failed" });
    return; // Important: prevent further execution
  }
};

// Export as authenticateUser as well for backward compatibility
export const authenticateUser = authenticate;
