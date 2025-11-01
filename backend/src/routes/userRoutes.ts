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
  getUserByUid,
} from "../controllers/userControllers";
import { authenticate } from "../middleware/authMiddleware";
import { searchUsers } from "../controllers/searchUsers";

const router = express.Router();

router.get("/userId/:uid", getUserByUid);
// router.get("/userId/:uid")
// router.get("/user/username/:username", getUsernameFromUid);
router.get("/check-username/:username", checkUsernameAvailability);
router.get("/search", searchUsers);

router.put("/update", authenticate, updateUserProfile);
router.put("/stats", authenticate, updateUserStats);
router.post("/follow", authenticate, toggleFollow);
router.put("/yearly-goal", authenticate, updateYearlyGoal);
router.put("/favorite-books", authenticate, updateFavoriteBooks);

router.get("/:handle", getUserByHandle);

export default router;
