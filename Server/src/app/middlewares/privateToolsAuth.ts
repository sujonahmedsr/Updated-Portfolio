import { timingSafeEqual } from "crypto";
import { NextFunction, Request, Response } from "express";

export function privateToolsAuth(req: Request, res: Response, next: NextFunction) {
  const expected = process.env.PRIVATE_DATA_API_KEY;
  const supplied = req.header("x-private-data-key") || "";
  if (!expected) {
    res.status(503).json({ success: false, message: "Set PRIVATE_DATA_API_KEY on the backend to match the dashboard value" });
    return;
  }

  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(supplied);
  if (!supplied || suppliedBuffer.length !== expectedBuffer.length || !timingSafeEqual(suppliedBuffer, expectedBuffer)) {
    res.status(401).json({ success: false, message: "Private API key is missing or does not match" });
    return;
  }
  next();
}