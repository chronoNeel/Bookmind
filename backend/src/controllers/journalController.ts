import { Request, Response } from "express";
import { db } from "../config/firebaseAdmin";
import { asyncHandler } from "../middleware/errorHandler";
import admin from "firebase-admin";
import {
  CreateJournalDto,
  UpdateJournalDto,
  VoteJournalDto,
} from "../models/Journal";
import { requireUser } from "../utils/requireUser";

export const createJournal = asyncHandler(
  async (req: Request, res: Response) => {
    const user = requireUser(req);
    const userId = user.uid;
    const journalData: CreateJournalDto = req.body;

    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.data();

    if (!userData) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const journal = {
      userId,
      userName: userData.fullName,
      userProfilePic: userData.profilePic,
      ...journalData,
      upvotes: 0,
      downvotes: 0,
      upvotedBy: [],
      downvotedBy: [],
      isPublic: journalData.isPublic ?? true,
      createdAt: new Date().toISOString(),
    };

    const journalRef = await db.collection("journals").add(journal);

    await db
      .collection("bookJournals")
      .doc(journalData.bookId)
      .set(
        {
          journalIds: admin.firestore.FieldValue.arrayUnion(journalRef.id),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

    // Update user stats
    await db
      .collection("users")
      .doc(userId)
      .update({
        "stats.totalJournals": admin.firestore.FieldValue.increment(1),
      });

    res.status(201).json({ status: "ok", journalId: journalRef.id });
  }
);

export const getJournalsByUser = asyncHandler(
  async (req: Request, res: Response) => {
    const user = requireUser(req);
    const { uid } = req.params;

    // Allow users to view their own journals or only public journals of others
    const isOwnProfile = user.uid === uid;

    let query = db.collection("journals").where("userId", "==", uid);

    if (!isOwnProfile) {
      query = query.where("isPublic", "==", true);
    }

    const snapshot = await query.orderBy("createdAt", "desc").get();

    const journals = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ status: "ok", journals });
  }
);

export const updateJournal = asyncHandler(
  async (req: Request, res: Response) => {
    const user = requireUser(req);
    const userId = user.uid;
    const { id } = req.params;
    const updateData: UpdateJournalDto = req.body;

    const journalRef = db.collection("journals").doc(id);
    const journalDoc = await journalRef.get();

    if (!journalDoc.exists) {
      res.status(404).json({ error: "Journal not found" });
      return;
    }

    const journalData = journalDoc.data()!;

    // Check if user owns this journal
    if (journalData.userId !== userId) {
      res.status(403).json({ error: "Unauthorized to update this journal" });
      return;
    }

    await journalRef.update({
      ...updateData,
      updatedAt: new Date().toISOString(),
    });

    res.json({ status: "ok", message: "Journal updated successfully" });
  }
);

export const voteJournal = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);
  const userId = user.uid;
  const { id } = req.params;
  const { voteType }: VoteJournalDto = req.body;

  const journalRef = db.collection("journals").doc(id);
  const journalDoc = await journalRef.get();

  if (!journalDoc.exists) {
    res.status(404).json({ error: "Journal not found" });
    return;
  }

  const journalData = journalDoc.data()!;
  const upvotedBy: string[] = journalData.upvotedBy || [];
  const downvotedBy: string[] = journalData.downvotedBy || [];

  const hasUpvoted = upvotedBy.includes(userId);
  const hasDownvoted = downvotedBy.includes(userId);

  const updates: any = {};

  if (voteType === "upvote") {
    if (hasUpvoted) {
      updates.upvotes = admin.firestore.FieldValue.increment(-1);
      updates.upvotedBy = admin.firestore.FieldValue.arrayRemove(userId);
    } else {
      updates.upvotes = admin.firestore.FieldValue.increment(1);
      updates.upvotedBy = admin.firestore.FieldValue.arrayUnion(userId);
      if (hasDownvoted) {
        updates.downvotes = admin.firestore.FieldValue.increment(-1);
        updates.downvotedBy = admin.firestore.FieldValue.arrayRemove(userId);
      }
    }
  } else if (voteType === "downvote") {
    if (hasDownvoted) {
      updates.downvotes = admin.firestore.FieldValue.increment(-1);
      updates.downvotedBy = admin.firestore.FieldValue.arrayRemove(userId);
    } else {
      updates.downvotes = admin.firestore.FieldValue.increment(1);
      updates.downvotedBy = admin.firestore.FieldValue.arrayUnion(userId);
      if (hasUpvoted) {
        updates.upvotes = admin.firestore.FieldValue.increment(-1);
        updates.upvotedBy = admin.firestore.FieldValue.arrayRemove(userId);
      }
    }
  } else if (voteType === "remove") {
    if (hasUpvoted) {
      updates.upvotes = admin.firestore.FieldValue.increment(-1);
      updates.upvotedBy = admin.firestore.FieldValue.arrayRemove(userId);
    }
    if (hasDownvoted) {
      updates.downvotes = admin.firestore.FieldValue.increment(-1);
      updates.downvotedBy = admin.firestore.FieldValue.arrayRemove(userId);
    }
  }

  await journalRef.update(updates);

  res.json({ status: "ok", message: "Vote updated successfully" });
});
