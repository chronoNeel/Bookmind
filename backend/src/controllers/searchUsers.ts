import { Request, Response } from "express";
import { db } from "../config/firebaseAdmin";
import { asyncHandler } from "../middleware/errorHandler";

export const searchUsers = asyncHandler(async (req: Request, res: Response) => {
  const { q } = req.query;
  const searchTerm = (q as string)?.trim().toLowerCase();

  if (!searchTerm) {
    res.status(400).json({ error: "Search query is required" });
    return;
  }

  const userRef = db.collection("users");

  const usernameQuery = userRef
    .where("userName", ">=", searchTerm)
    .where("userName", "<=", searchTerm + "\uf8ff");

  const fullNameQuery = userRef
    .where("userName", ">=", searchTerm)
    .where("userName", "<=", searchTerm + "\uf8ff");

  const [usernameSnap, fullNameSnap] = await Promise.all([
    usernameQuery.get(),
    fullNameQuery.get(),
  ]);

  const resultsMap = new Map<string, any>();

  usernameSnap.forEach((doc) => resultsMap.set(doc.id, doc.data()));
  fullNameSnap.forEach((doc) => resultsMap.set(doc.id, doc.data()));

  const results = Array.from(resultsMap.values());

  res.status(200).json({
    status: "ok",
    count: results.length,
    users: results,
  });
});
