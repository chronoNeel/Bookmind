import { Request, Response } from "express";
import { db } from "../config/firebaseAdmin";
import { asyncHandler } from "../middleware/errorHandler";
import { DecodedIdToken } from "firebase-admin/auth";
import { ShelfBook } from "../models/User";

type ShelfStatus = "wantToRead" | "ongoing" | "completed" | "remove" | null;
const SHELVES = ["completed", "ongoing", "wantToRead"] as const;
type ShelfKey = (typeof SHELVES)[number];

interface RequestWithUser extends Request {
  user?: DecodedIdToken;
}

function requireUser(req: RequestWithUser) {
  const uid = req.user?.uid;
  if (!uid) {
    const err: any = new Error("Unauthorized - No user found");
    err.status = 401;
    throw err;
  }
  return uid;
}

export const setBookStatus = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const uid = requireUser(req);
    const { bookKey, status } = req.body;

    if (typeof bookKey !== "string" || !bookKey.trim()) {
      return res.status(400).json({ error: "bookKey is required" });
    }

    const normalizedStatus = (status ?? "remove") as Exclude<ShelfStatus, null>;
    if (
      normalizedStatus !== "remove" &&
      !SHELVES.includes(normalizedStatus as ShelfKey)
    ) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userSnap.data() || {};
    const shelves = userData.shelves || {};
    const now = new Date().toISOString();

    const updateData: Record<string, any> = { updatedAt: now };
    for (const shelf of SHELVES) {
      const list: ShelfBook[] = shelves[shelf] || [];
      updateData[`shelves.${shelf}`] = list.filter(
        (b) => b.bookKey !== bookKey
      );
    }

    if (normalizedStatus !== "remove") {
      const list: ShelfBook[] = shelves[normalizedStatus] || [];
      const filtered = list.filter((b) => b.bookKey !== bookKey);
      updateData[`shelves.${normalizedStatus}`] = [
        ...filtered,
        { bookKey, updatedAt: now } as ShelfBook,
      ];
    }

    await userRef.update(updateData);

    return res.json({
      status: "ok",
      message:
        normalizedStatus !== "remove"
          ? `Book added to ${normalizedStatus} shelf`
          : "Book removed from shelves",
    });
  }
);
