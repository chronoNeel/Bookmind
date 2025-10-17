import { Request, Response } from "express";
import { db, FieldValue } from "../config/firebaseAdmin";
import { asyncHandler } from "../middleware/errorHandler";
import { UpdateUserProfileDto, UpdateUserStatsDto } from "../models/User";
import { requireUser } from "../utils/requireUser";

// get user by profile uId

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { uid } = req.params;
  const userDoc = await db.collection("users").doc(uid).get();

  if (!userDoc.exists) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(userDoc.data());
});

// update user profile
export const updateUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const user = requireUser(req);
    const updates: UpdateUserProfileDto = req.body;

    await db
      .collection("users")
      .doc(user.uid)
      .update({
        ...updates,
        updatedAt: new Date().toISOString(),
      });

    res.json({ status: "ok", message: "Profile updated successfully" });
  }
);

//  update user stat

export const updateUserStats = asyncHandler(
  async (req: Request, res: Response) => {
    const user = requireUser(req);
    const statsUpdates: UpdateUserStatsDto = req.body;

    const updateData: any = { updatedAt: new Date().toISOString() };
    Object.keys(statsUpdates).forEach((key) => {
      updateData[`stats.${key}`] =
        statsUpdates[key as keyof UpdateUserStatsDto];
    });

    await db.collection("users").doc(user.uid).update(updateData);
    res.json({ status: "ok", message: "Stats updated successfully" });
  }
);

// Shelf management
export const getUserShelves = asyncHandler(
  async (req: Request, res: Response) => {
    const { uid } = req.params;
    const doc = await db.collection("users").doc(uid).get();
    if (!doc.exists) return res.status(404).json({ error: "User not found" });

    const shelves = doc.data()?.shelves || {};
    res.json({ status: "ok", shelves });
  }
);

export const addToShelf = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const { shelfName, book } = req.body;

  if (!shelfName || !book)
    return res.status(400).json({ error: "Shelf name and book are required" });

  const userRef = db.collection("users").doc(user.uid);
  await userRef.update({
    [`shelves.${shelfName}`]: FieldValue.arrayUnion(book),
    updatedAt: new Date().toISOString(),
  });

  res.json({ status: "ok", message: `Book added to ${shelfName} shelf` });
});

export const removeFromShelf = asyncHandler(
  async (req: Request, res: Response) => {
    const user = requireUser(req);
    const { shelfName, book } = req.body;

    if (!shelfName || !book)
      return res
        .status(400)
        .json({ error: "Shelf name and book are required" });

    const userRef = db.collection("users").doc(user.uid);
    await userRef.update({
      [`shelves.${shelfName}`]: FieldValue.arrayRemove(book),
      updatedAt: new Date().toISOString(),
    });

    res.json({ status: "ok", message: `Book removed from ${shelfName} shelf` });
  }
);

/**
 * Follow / Unfollow users
 */
export const toggleFollow = asyncHandler(
  async (req: Request, res: Response) => {
    const user = requireUser(req);
    const { targetUid } = req.body;
    if (!targetUid)
      return res.status(400).json({ error: "Target UID is required" });

    const targetRef = db.collection("users").doc(targetUid);
    const targetDoc = await targetRef.get();
    if (!targetDoc.exists)
      return res.status(404).json({ error: "Target user not found" });

    const userRef = db.collection("users").doc(user.uid);
    const isFollowing = targetDoc.data()?.followers?.includes(user.uid);

    if (isFollowing) {
      await userRef.update({ following: FieldValue.arrayRemove(targetUid) });
      await targetRef.update({
        followers: FieldValue.arrayRemove(user.uid),
      });
      res.json({ status: "ok", message: "Unfollowed successfully" });
    } else {
      await userRef.update({ following: FieldValue.arrayUnion(targetUid) });
      await targetRef.update({ followers: FieldValue.arrayUnion(user.uid) });
      res.json({ status: "ok", message: "Followed successfully" });
    }
  }
);

/**
 * Update yearly reading goal
 */
export const updateYearlyGoal = asyncHandler(
  async (req: Request, res: Response) => {
    const user = requireUser(req);
    const { yearlyGoal } = req.body;

    if (typeof yearlyGoal !== "number")
      return res.status(400).json({ error: "Yearly goal must be a number" });

    await db.collection("users").doc(user.uid).update({
      "stats.yearlyGoal": yearlyGoal,
      updatedAt: new Date().toISOString(),
    });

    res.json({ status: "ok", message: "Yearly goal updated successfully" });
  }
);
