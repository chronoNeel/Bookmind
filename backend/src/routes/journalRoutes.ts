import express from "express";
import {
  createJournal,
  getAllPublicJournals,
  getJournalsByUser,
  getJournalById,
  upvoteJournal,
  downvoteJournal,
  updateJournal,
  deleteJournal,
} from "../controllers/journalController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authenticateUser, createJournal);
router.put("/update/:journalId", authenticateUser, updateJournal);

router.get("/upvote/:journalId", authenticateUser, upvoteJournal);
router.get("/downvote/:journalId", authenticateUser, downvoteJournal);

router.get("/public", getAllPublicJournals);
router.get("/user/:uid", getJournalsByUser);

router.delete("/:journalId", authenticateUser, deleteJournal);

router.get("/:journalId", getJournalById);

export default router;
