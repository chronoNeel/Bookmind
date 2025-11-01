import { Request, Response } from "express";
import { db } from "../config/firebaseAdmin";
import { asyncHandler } from "../middleware/errorHandler";
import { DecodedIdToken } from "firebase-admin/auth";

interface RequestWithUser extends Request {
  user?: DecodedIdToken;
}

export default interface JournalEntry {
  bookKey: string;
  bookTitle: string;
  bookAuthorList: string[];
  bookCoverUrl: string;

  rating: number;
  readingProgress: number;
  isPrivate: boolean;
  mood: string;
  promptResponses: {
    [key: string]: string;
  };
  entry: string;

  userId?: string;

  upvotedBy: string[];
  downvotedBy: string[];

  createdAt: string;
  updatedAt: string;
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

// creating journal
export const createJournal = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const userId = requireUser(req);
    const {
      bookKey,
      bookTitle,
      bookAuthorList,
      bookCoverUrl,
      rating,
      readingProgress,
      isPrivate,
      mood,
      promptResponses,
      entry,
      createdAt,
      updatedAt,
    }: JournalEntry = req.body;

    const journalData = {
      bookKey,
      bookTitle,
      bookAuthorList,
      bookCoverUrl,
      rating,
      readingProgress,
      isPrivate,
      mood,
      promptResponses,
      entry,
      userId,
      upvotedBy: [],
      downvotedBy: [],
      createdAt,
      updatedAt,
    };

    const journalRef = await db.collection("journals").add(journalData);

    res.status(201).json({
      status: "ok",
      journalId: journalRef.id,
      journal: { id: journalRef.id, ...journalData },
    });
  }
);

export const getAllPublicJournals = asyncHandler(
  async (req: Request, res: Response) => {
    const allJournals = await db
      .collection("journals")
      .where("isPrivate", "==", false)
      .get();

    const journals = allJournals.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort((a: any, b: any) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

    res.status(200).json({ status: "ok", journals });
  }
);

export const getJournalsByUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { uid } = req.params;

    if (!uid) {
      const err: any = new Error("User ID is required");
      err.status = 400;
      throw err;
    }
    console.log("Uid ", uid);

    const allJournals = await db
      .collection("journals")
      .where("userId", "==", uid)
      .get();

    console.log("Journal by user ", allJournals.docs);

    const journals = allJournals.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ status: "ok", journals });
  }
);

export const getJournalById = asyncHandler(
  async (req: Request, res: Response) => {
    const { journalId } = req.params;

    if (!journalId) {
      const err: any = new Error("Journal ID is required");
      err.status = 400;
      throw err;
    }

    const journalDoc = await db.collection("journals").doc(journalId).get();

    if (!journalDoc.exists) {
      const err: any = new Error("Journal not found");
      err.status = 404;
      throw err;
    }

    const journal = {
      id: journalDoc.id,
      ...journalDoc.data(),
    };

    res.status(200).json({ status: "ok", journal });
  }
);

export const upvoteJournal = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const userId = requireUser(req);
    const { journalId } = req.params;

    const journalRef = db.collection("journals").doc(journalId);
    const journalDoc = await journalRef.get();

    if (!journalDoc.exists) {
      const err: any = new Error("Journal not found");
      err.status = 404;
      throw err;
    }

    const journalData = journalDoc.data();
    const upvotedBy = journalData?.upvotedBy || [];
    const downvotedBy = journalData?.downvotedBy || [];

    if (upvotedBy.includes(userId)) {
      await journalRef.update({
        upvotedBy: upvotedBy.filter((id: string) => id !== userId),
        updatedAt: new Date().toISOString(),
      });
      return res.status(200).json({ status: "ok", message: "Upvote removed" });
    }

    const updates: any = {
      upvotedBy: [...upvotedBy, userId],
      updatedAt: new Date().toISOString(),
    };

    if (downvotedBy.includes(userId)) {
      updates.downvotedBy = downvotedBy.filter((id: string) => id !== userId);
    }

    await journalRef.update(updates);
    res.status(200).json({ status: "ok", message: "Journal upvoted" });
  }
);

export const downvoteJournal = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const userId = requireUser(req);
    const { journalId } = req.params;

    const journalRef = db.collection("journals").doc(journalId);
    const journalDoc = await journalRef.get();

    if (!journalDoc.exists) {
      const err: any = new Error("Journal not found");
      err.status = 404;
      throw err;
    }

    const journalData = journalDoc.data();
    const upvotedBy = journalData?.upvotedBy || [];
    const downvotedBy = journalData?.downvotedBy || [];

    if (downvotedBy.includes(userId)) {
      await journalRef.update({
        downvotedBy: downvotedBy.filter((id: string) => id !== userId),
        updatedAt: new Date().toISOString(),
      });
      return res
        .status(200)
        .json({ status: "ok", message: "Downvote removed" });
    }

    const updates: any = {
      downvotedBy: [...downvotedBy, userId],
      updatedAt: new Date().toISOString(),
    };

    if (upvotedBy.includes(userId)) {
      updates.upvotedBy = upvotedBy.filter((id: string) => id !== userId);
    }

    await journalRef.update(updates);
    res.status(200).json({ status: "ok", message: "Journal downvoted" });
  }
);

export const updateJournal = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const userId = requireUser(req);
    const { journalId } = req.params;

    const journalRef = db.collection("journals").doc(journalId);
    const journalDoc = await journalRef.get();

    if (!journalDoc.exists) {
      const err: any = new Error("Journal not found");
      err.status = 404;
      throw err;
    }

    const journalData = journalDoc.data();

    if (journalData?.userId != userId) {
      const err: any = new Error("Unauthorized");
      err.status = 403;
      throw err;
    }

    const {
      bookKey,
      bookTitle,
      bookAuthorList,
      bookCoverUrl,
      rating,
      readingProgress,
      isPrivate,
      mood,
      promptResponses,
      entry,
    } = req.body;

    const updates: Partial<JournalEntry> = {
      updatedAt: new Date().toISOString(),
    };

    if (bookKey !== undefined) updates.bookKey = bookKey;
    if (bookTitle !== undefined) updates.bookTitle = bookTitle;
    if (bookAuthorList !== undefined) updates.bookAuthorList = bookAuthorList;
    if (bookCoverUrl !== undefined) updates.bookCoverUrl = bookCoverUrl;
    if (rating !== undefined) updates.rating = rating;
    if (readingProgress !== undefined)
      updates.readingProgress = readingProgress;
    if (isPrivate !== undefined) updates.isPrivate = isPrivate;
    if (mood !== undefined) updates.mood = mood;
    if (promptResponses !== undefined)
      updates.promptResponses = promptResponses;
    if (entry !== undefined) updates.entry = entry;

    await journalRef.update(updates);

    const updatedDoc = await journalRef.get();
    const updatedJournal = {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    };

    res.status(200).json({
      status: "ok",
      journal: updatedJournal,
    });
  }
);

export const deleteJournal = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const userId = requireUser(req);
    const { journalId } = req.params;

    if (!journalId) {
      const err: any = new Error("Journal ID is required");
      err.status = 400;
      throw err;
    }

    const journalRef = db.collection("journals").doc(journalId);
    const journalDoc = await journalRef.get();

    if (!journalDoc.exists) {
      const err: any = new Error("Journal not found");
      err.status = 404;
      throw err;
    }

    const journalData = journalDoc.data();

    // Ensure only owner can delete
    if (journalData?.userId !== userId) {
      const err: any = new Error("Unauthorized - cannot delete this journal");
      err.status = 403;
      throw err;
    }

    await journalRef.delete();

    res.status(200).json({
      status: "ok",
      message: "Journal deleted successfully",
      journalId,
    });
  }
);
