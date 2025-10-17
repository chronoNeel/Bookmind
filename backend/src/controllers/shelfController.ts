// import { Request, Response } from "express";
// import { db } from "../config/firebaseAdmin";
// import { asyncHandler } from "../middleware/errorHandler";
// import admin from "firebase-admin";
// import { UpdateShelfDto } from "../models/Shelf";
// import { requireUser } from "../utils/requireUser";

// export const getUserShelf = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { uid } = req.params;

//     const shelfDoc = await db.collection("shelves").doc(uid).get();

//     if (!shelfDoc.exists) {
//       res.json({
//         status: "ok",
//         shelf: {
//           userId: uid,
//           completed: [],
//           ongoing: [],
//           wantToRead: [],
//           updatedAt: new Date().toISOString(),
//         },
//       });
//       return;
//     }

//     res.json({ status: "ok", shelf: shelfDoc.data() });
//   }
// );

// export const updateShelf = asyncHandler(async (req: Request, res: Response) => {
//   const user = requireUser(req);
//   const userId = user.uid;
//   const { bookId, fromShelf, toShelf }: UpdateShelfDto = req.body;

//   const shelfRef = db.collection("shelves").doc(userId);
//   const shelfDoc = await shelfRef.get();

//   const batch = db.batch();

//   // If shelf doesn't exist, create it
//   if (!shelfDoc.exists) {
//     batch.set(shelfRef, {
//       userId,
//       completed: toShelf === "completed" ? [bookId] : [],
//       ongoing: toShelf === "ongoing" ? [bookId] : [],
//       wantToRead: toShelf === "wantToRead" ? [bookId] : [],
//       updatedAt: new Date().toISOString(),
//     });
//   } else {
//     if (fromShelf) {
//       batch.update(shelfRef, {
//         [fromShelf]: admin.firestore.FieldValue.arrayRemove(bookId),
//         updatedAt: new Date().toISOString(),
//       });
//     }
//     batch.update(shelfRef, {
//       [toShelf]: admin.firestore.FieldValue.arrayUnion(bookId),
//       updatedAt: new Date().toISOString(),
//     });
//   }

//   // Update user stats
//   const userRef = db.collection("users").doc(userId);
//   const statsUpdate: any = {};

//   if (fromShelf) {
//     statsUpdate[`stats.${fromShelf}Count`] =
//       admin.firestore.FieldValue.increment(-1);
//   }
//   statsUpdate[`stats.${toShelf}Count`] =
//     admin.firestore.FieldValue.increment(1);

//   if (toShelf === "completed") {
//     statsUpdate["stats.booksReadThisYear"] =
//       admin.firestore.FieldValue.arrayUnion(bookId);
//   }

//   batch.update(userRef, statsUpdate);

//   await batch.commit();

//   res.json({ status: "ok", message: "Shelf updated successfully" });
// });
