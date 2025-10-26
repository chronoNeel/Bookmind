import express from "express";
import {
  createJournal,
  getAllPublicJournals,
  getJournalsByUser,
  getJournalById,
  upvoteJournal,
  downvoteJournal,
  updateJournal,
} from "../controllers/journalController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authenticateUser, createJournal);
router.put("/update/:journalId", authenticateUser, updateJournal);

router.get("/public", authenticateUser, getAllPublicJournals);
router.get("/user/:uid", authenticateUser, getJournalsByUser);
router.get("/:journalId", getJournalById);
router.get("/upvote/:journalId", authenticateUser, upvoteJournal);
router.get("/downvote/:journalId", authenticateUser, downvoteJournal);

export default router;
