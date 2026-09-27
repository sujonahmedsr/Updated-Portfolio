import { timingSafeEqual } from "crypto";
import { NextFunction, Request, Response } from "express";

export function privateToolsAuth(req: Request, res: Response, next: NextFunction) {
  const expected = process.env.PRIVATE_DATA_API_KEY;
  const supplied = req.header("x-private-data-key") || "";
  if (!expected || supplied.length !== expected.length || !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }
  next();
}