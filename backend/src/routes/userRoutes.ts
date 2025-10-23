import express from "express";
import {
  getUserByHandle,
  updateUserProfile,
  updateUserStats,
  checkUsernameAvailability,
  updateYearlyGoal,
  toggleFollow,
  getUsernameFromUid,
  updateFavoriteBooks,
} from "../controllers/userControllers";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/userId/:uid", getUsernameFromUid);
router.get("/check-username/:username", checkUsernameAvailability);

router.get("/:handle", getUserByHandle);

router.put("/update", authenticate, updateUserProfile);
router.put("/stats", authenticate, updateUserStats);
router.post("/follow", authenticate, toggleFollow);
router.put("/yearly-goal", authenticate, updateYearlyGoal);
router.put("/favorite-books", authenticate, updateFavoriteBooks);

export default router;
