import express from "express";
import {
  createJournal,
  getAllPublicJournals,
  getJournalsByUser,
  getJournalById,
  upvoteJournal,
  downvoteJournal,
} from "../controllers/journalController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authenticateUser, createJournal);
router.get("/public", authenticateUser, getAllPublicJournals);
router.get("/user/:uid", authenticateUser, getJournalsByUser);
router.get("/:journalId", authenticateUser, getJournalById);
router.get("/upvote/:journalId", authenticateUser, upvoteJournal);
router.get("/downvote/:journalId", authenticateUser, downvoteJournal);

export default router;
