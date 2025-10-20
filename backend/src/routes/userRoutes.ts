import express from "express";
import {
  getUserByHandle,
  updateUserProfile,
  updateUserStats,
  checkUsernameAvailability,
  updateYearlyGoal,
  toggleFollow,
} from "../controllers/userControllers";

import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

// Public route - no authentication needed
router.get("/:handle", getUserByHandle);
router.get("/check-username/:username", checkUsernameAvailability);

// Protected routes
router.put("/update", authenticate, updateUserProfile);
router.put("/stats", authenticate, updateUserStats);
router.post("/follow", authenticate, toggleFollow);
router.put("/yearly-goal", authenticate, updateYearlyGoal);

export default router;
