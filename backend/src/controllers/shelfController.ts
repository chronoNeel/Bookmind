import { Request, Response } from "express";
import { db } from "../config/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
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

    // Get current user data to find and remove the book from all shelves
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userDoc.data();
    const shelves = userData?.shelves || {};

    // Build the update object
    const updateData: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    // Remove the book from all shelves by filtering out matching bookKey
    SHELVES.forEach((shelfName) => {
      const shelfBooks: ShelfBook[] = shelves[shelfName] || [];
      const filteredBooks = shelfBooks.filter(
        (book) => book.bookKey !== bookKey
      );
      updateData[`shelves.${shelfName}`] = filteredBooks;
    });

    // If not removing, add the book to the target shelf with updated timestamp
    if (normalizedStatus !== "remove") {
      const currentShelf: ShelfBook[] = shelves[normalizedStatus] || [];
      const filteredShelf = currentShelf.filter(
        (book) => book.bookKey !== bookKey
      );

      const newShelfBook: ShelfBook = {
        bookKey,
        updatedAt: new Date().toISOString(),
      };

      updateData[`shelves.${normalizedStatus}`] = [
        ...filteredShelf,
        newShelfBook,
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
