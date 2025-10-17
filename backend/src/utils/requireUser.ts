import { Request } from "express";
import admin from "firebase-admin";

export function requireUser(req: Request): admin.auth.DecodedIdToken {
  if (!req.user) {
    // You can throw an error or return a specific shape — throwing keeps flow concise.
    // But throwing will be handled by asyncHandler/error middleware if you use it.
    throw new Error("Unauthorized: user not found on request");
  }
  return req.user;
}
