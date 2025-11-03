import { db } from "../config/firebaseAdmin";
import { asyncHandler } from "../middleware/errorHandler";
import { Response, Request } from "express";

export const getAllActivites = asyncHandler(
  async (req: Request, res: Response) => {
    const allActivitiesSnapshot = await db.collection("activity_feed").get();

    const allActivities = allActivitiesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ status: "ok", activities: allActivities });
  }
);
