// src/routes/shelfRoutes.ts
import { Router, Request, Response, NextFunction } from "express";
import { setBookStatus } from "../controllers/shelfController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = Router();

router.post("/set-status", authenticateUser, setBookStatus);

export default router;
