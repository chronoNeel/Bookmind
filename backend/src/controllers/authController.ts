import { Request, Response } from "express";
import { db, verifyToken } from "../config/firebaseAdmin";
import { User } from "../models/User";
import { asyncHandler } from "../middleware/errorHandler";

export const register = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { displayName, token } = req.body;

    if (!displayName || !token) {
      res.status(400).json({ error: "Display name and token are required" });
      return;
    }

    const decodedToken = await verifyToken(token);

    if (!decodedToken) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    const userData: User = {
      uid: decodedToken.uid,
      email: decodedToken.email || "",
      displayName: displayName,
      createdAt: new Date().toISOString(),
      role: "user",
    };

    await db.collection("users").doc(decodedToken.uid).set(userData);

    res.status(201).json({
      status: "ok",
      message: "User registered successfully",
      uid: decodedToken.uid,
    });
  }
);

export const verifyUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({ error: "Token is required" });
      return;
    }

    const decodedToken = await verifyToken(token);

    if (!decodedToken) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    res.json({
      status: "ok",
      uid: decodedToken.uid,
      email: decodedToken.email,
    });
  }
);
