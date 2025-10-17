import express from "express";
import {
  createJournal,
  getJournalsByUser,
  updateJournal,
  voteJournal,
} from "../controllers/journalController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authenticateUser, createJournal);
router.get("/user/:uid", authenticateUser, getJournalsByUser);
router.put("/:id", authenticateUser, updateJournal);
router.post("/:id/vote", authenticateUser, voteJournal);

export default router;
