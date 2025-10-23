import { Request, Response } from "express";
import { db, verifyToken } from "../config/firebaseAdmin";
import { User } from "../models/User";
import { asyncHandler } from "../middleware/errorHandler";

function generateUserName(fullName: string, uid: string): string {
  const baseName = fullName.replace(/\s+/g, "").toLowerCase();
  const uidPart = uid.substring(0, 8);
  const randomNum = Math.floor(100 + Math.random() * 900);
  return `${baseName}_${uidPart}_${randomNum}`;
}

export const register = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { fullName, token } = req.body;

    if (!fullName || !token) {
      res.status(400).json({ error: "Full name and token are required" });
      return;
    }

    const decodedToken = await verifyToken(token);

    if (!decodedToken) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    // Check if user already exists
    const userDoc = await db.collection("users").doc(decodedToken.uid).get();

    if (userDoc.exists) {
      res.status(200).json({
        status: "ok",
        message: "User already exists",
        user: userDoc.data(),
      });
      return;
    }

    const userData: User = {
      uid: decodedToken.uid,
      email: decodedToken.email || "",
      fullName: fullName,
      userName: generateUserName(fullName, decodedToken.uid),
      bio: "",
      profilePic:
        "https://ui-avatars.com/api/?name=" +
        encodeURIComponent(fullName) +
        "&size=200&background=f59e0b&color=fff",
      followers: [],
      following: [],
      favorites: [],

      shelves: {
        completed: [],
        ongoing: [],
        wantToRead: [],
      },

      stats: {
        yearlyGoal: 0,
        completedCount: 0,
        ongoingCount: 0,
        wantToReadCount: 0,
        booksReadThisYear: [],
        avgRating: 0,
        totalJournals: 0,
      },

      journals: [],

      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.collection("users").doc(decodedToken.uid).set(userData);

    res.status(201).json({
      status: "ok",
      message: "User registered successfully",
      user: userData,
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

    const userDoc = await db.collection("users").doc(decodedToken.uid).get();
    const userData = userDoc.exists ? userDoc.data() : null;

    res.json({
      status: "ok",
      uid: decodedToken.uid,
      email: decodedToken.email,
      fullName: userData?.fullName || null,
    });
  }
);
