import { Request, Response } from "express";
import { db, FieldValue } from "../config/firebaseAdmin";
import { asyncHandler } from "../middleware/errorHandler";
import { UpdateUserProfileDto, UpdateUserStatsDto } from "../models/User";
import { requireUser } from "../utils/requireUser";

interface UpdateUserProfileWithUsername extends UpdateUserProfileDto {
  userName?: string;
}

// Helper function to normalize username (case-insensitive)
const normalizeUserName = (userName: string): string => {
  return userName.toLowerCase().trim();
};

// Helper function to validate username format
const isValidUserName = (userName: string): boolean => {
  // Username must be 3-30 characters, alphanumeric with underscores/hyphens
  const regex = /^[a-zA-Z0-9_-]{3,30}$/;
  return regex.test(userName);
};

// Get user by handle (uid or username)
export const getUserByHandle = asyncHandler(
  async (req: Request, res: Response) => {
    const { handle } = req.params;
    const trimmed = (handle || "").trim();

    if (!trimmed) {
      return res.status(400).json({ error: "Missing handle" });
    }

    // 1) Try direct doc by UID
    const doc = await db.collection("users").doc(trimmed).get();
    if (doc.exists) {
      return res.json(doc.data());
    }

    // 2) Fallback: lookup by userName (case-insensitive)
    const normalized = normalizeUserName(trimmed);
    const usernameDoc = await db.collection("usernames").doc(normalized).get();

    if (usernameDoc.exists) {
      const uid = usernameDoc.get("uid");
      const userDoc = await db.collection("users").doc(uid).get();

      if (userDoc.exists) {
        return res.json(userDoc.data());
      }
    }

    return res.status(404).json({ error: "User not found" });
  }
);

// Update user profile
export const updateUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const authUser = requireUser(req);
    const updates: UpdateUserProfileWithUsername = req.body;

    // Basic shape validation
    const safeUpdates: Record<string, any> = {};

    if (updates.fullName !== undefined) {
      safeUpdates.fullName = updates.fullName?.trim();
    }
    if (updates.bio !== undefined) {
      safeUpdates.bio = updates.bio ?? "";
    }
    if (updates.profilePic !== undefined) {
      safeUpdates.profilePic = updates.profilePic ?? "";
    }

    const usersRef = db.collection("users");
    const userRef = usersRef.doc(authUser.uid);
    const usernamesRef = db.collection("usernames");

    await db.runTransaction(async (tx) => {
      // Get current user data
      const userSnap = await tx.get(userRef);
      if (!userSnap.exists) {
        throw Object.assign(new Error("User not found"), { code: 404 });
      }

      const existing = userSnap.data() || {};
      const prevUserName: string | undefined = existing.userName;
      const prevNorm = prevUserName
        ? normalizeUserName(prevUserName)
        : undefined;

      // Handle username update if provided
      if (typeof updates.userName === "string") {
        const incoming = updates.userName.trim();

        // Validate username format
        if (!isValidUserName(incoming)) {
          throw Object.assign(
            new Error(
              "Invalid username format. Must be 3-30 characters (letters, numbers, underscores, hyphens only)"
            ),
            { code: 400 }
          );
        }

        const nextNorm = normalizeUserName(incoming);

        // Check if username is actually changing (case-insensitive comparison)
        if (prevNorm !== nextNorm) {
          // Check if new username is already taken by someone else
          const nextHandleRef = usernamesRef.doc(nextNorm);
          const nextHandleSnap = await tx.get(nextHandleRef);

          if (nextHandleSnap.exists) {
            const existingUid = nextHandleSnap.get("uid");
            if (existingUid !== authUser.uid) {
              throw Object.assign(new Error("Username already taken"), {
                code: 409,
              });
            }
          }

          // Reserve the new username
          tx.set(nextHandleRef, {
            uid: authUser.uid,
            userName: incoming, // Store with original casing for display
            normalized: nextNorm,
            createdAt: nextHandleSnap.exists
              ? nextHandleSnap.get("createdAt")
              : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });

          // Delete old username reservation if it exists
          if (prevNorm && prevNorm !== nextNorm) {
            const prevHandleRef = usernamesRef.doc(prevNorm);
            tx.delete(prevHandleRef);
          }
        }

        // Update username in user document (preserves casing)
        safeUpdates.userName = incoming;
      }

      // Update user document
      tx.update(userRef, {
        ...safeUpdates,
        updatedAt: new Date().toISOString(),
      });
    });

    res.json({
      status: "ok",
      message: "Profile updated successfully",
    });
  }
);

// Optional: Add endpoint to check username availability
export const checkUsernameAvailability = asyncHandler(
  async (req: Request, res: Response) => {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({
        available: false,
        error: "Username is required",
      });
    }

    if (!isValidUserName(username)) {
      return res.status(400).json({
        available: false,
        error:
          "Invalid username format. Must be 3-30 characters (letters, numbers, underscores, hyphens only)",
      });
    }

    const normalized = normalizeUserName(username);
    const usernameDoc = await db.collection("usernames").doc(normalized).get();

    res.json({
      available: !usernameDoc.exists,
      username: username,
    });
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

export const toggleFollow = asyncHandler(
  async (req: Request, res: Response) => {
    const authUser = requireUser(req);
    const { targetUid } = req.body;

    if (!targetUid) {
      return res.status(400).json({ error: "Target user ID is required" });
    }

    if (authUser.uid === targetUid) {
      return res.status(400).json({ error: "Cannot follow yourself" });
    }

    const currentUserRef = db.collection("users").doc(authUser.uid);
    const targetUserRef = db.collection("users").doc(targetUid);

    // Check if target user exists
    const targetDoc = await targetUserRef.get();
    if (!targetDoc.exists) {
      return res.status(404).json({ error: "Target user not found" });
    }

    // Get current user data
    const currentDoc = await currentUserRef.get();
    const currentData = currentDoc.data();
    const isFollowing = currentData?.following?.includes(targetUid) || false;

    const batch = db.batch();

    if (isFollowing) {
      // Unfollow
      batch.update(currentUserRef, {
        following: FieldValue.arrayRemove(targetUid),
        updatedAt: new Date().toISOString(),
      });
      batch.update(targetUserRef, {
        followers: FieldValue.arrayRemove(authUser.uid),
        updatedAt: new Date().toISOString(),
      });
    } else {
      // Follow
      batch.update(currentUserRef, {
        following: FieldValue.arrayUnion(targetUid),
        updatedAt: new Date().toISOString(),
      });
      batch.update(targetUserRef, {
        followers: FieldValue.arrayUnion(authUser.uid),
        updatedAt: new Date().toISOString(),
      });
    }

    await batch.commit();

    res.json({
      status: "ok",
      message: isFollowing
        ? "Unfollowed successfully"
        : "Followed successfully",
      isFollowing: !isFollowing,
    });
  }
);

/**
 * Update yearly reading goal
 */
export const updatekYearlyGoal = asyncHandler(
  async (req: Request, res: Response) => {
    const user = requireUser(req);
    const { yearlyGoal } = req.body;

    await db.collection("users").doc(user.uid).update({
      "stats.yearlyGoal": yearlyGoal,
      updatedAt: new Date().toISOString(),
    });

    res.json({ status: "ok", message: "Yearly goal updated successfully" });
  }
);

export const updateYearlyGoal = asyncHandler(
  async (req: Request, res: Response) => {
    const user = requireUser(req);
    const { yearlyGoal } = req.body;

    await db.collection("users").doc(user.uid).update({
      "stats.yearlyGoal": yearlyGoal,
      updatedAt: new Date().toISOString(),
    });

    res.json({
      status: "ok",
      message: "Yearly goal updated successfully",
      yearlyGoal,
    });
  }
);
