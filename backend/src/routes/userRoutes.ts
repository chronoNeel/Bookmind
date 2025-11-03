import express from "express";
import {
  updateUserProfile,
  updateUserStats,
  checkUsernameAvailability,
  updateYearlyGoal,
  toggleFollow,
  updateFavoriteBooks,
  fetchUserProfileByIdentifier,
} from "../controllers/userControllers";
import { authenticate } from "../middleware/authMiddleware";
import { searchUsers } from "../controllers/searchUsers";
import { getAllActivites } from "../controllers/activityController";

const router = express.Router();

// router.get("/userId/:uid")
// router.get("/user/username/:username", getUsernameFromUid);
router.get("/check-username/:username", checkUsernameAvailability);
router.get("/search", searchUsers);
router.get("/getAllActivities", getAllActivites);

router.put("/update", authenticate, updateUserProfile);
router.put("/stats", authenticate, updateUserStats);
router.post("/follow", authenticate, toggleFollow);
router.put("/yearly-goal", authenticate, updateYearlyGoal);
router.put("/favorite-books", authenticate, updateFavoriteBooks);

router.get("/:identifier", fetchUserProfileByIdentifier);

export default router;
