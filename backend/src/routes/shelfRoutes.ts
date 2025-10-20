// src/routes/shelfRoutes.ts
import { Router, Request, Response, NextFunction } from "express";
import { setBookStatus } from "../controllers/shelfController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

const logRequestBody = (req: Request, _res: Response, next: NextFunction) => {
  console.log("[/api/shelves/set-status] body:", req.body);
  console.log("[/api/shelves/set-status] query:", req.query);
  console.log("[/api/shelves/set-status] params:", req.params);
  // Optional (mask token if present)
  const auth = req.headers.authorization;
  if (auth)
    console.log(
      "[/api/shelves/set-status] auth:",
      auth.replace(/(Bearer\s+).+/, "$1***")
    );
  next();
};

router.post("/set-status", authenticate, logRequestBody, setBookStatus);

export default router;
