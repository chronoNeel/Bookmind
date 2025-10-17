import express from "express";
import {
  getUserById,
  updateUserProfile,
  updateUserStats,
  getUserShelves,
  addToShelf,
  removeFromShelf,
  updateYearlyGoal,
  toggleFollow,
} from "../controllers/userControllers";

import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

// Public route - no authentication needed
router.get("/:uid", getUserById);

// Protected routes - authentication required
router.put("/profile", authenticate, updateUserProfile);
router.put("/stats", authenticate, updateUserStats);
router.get("/shelves/:uid", getUserShelves);
router.post("/shelves/add", authenticate, addToShelf);
router.post("/shelves/remove", authenticate, removeFromShelf);
router.post("/follow", authenticate, toggleFollow);
router.put("/yearly-goal", authenticate, updateYearlyGoal);

export default router;
