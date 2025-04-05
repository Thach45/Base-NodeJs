import { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv';
dotenv.config();
const validApiKey = process.env.API_KEY as string;

export const checkApiKey = (req: Request, res: Response, next: NextFunction):void => {
  const apiKey = req.headers["x-api-key"];
  console.log(validApiKey);
  if (!apiKey || apiKey !== validApiKey) {
    res.status(401).json({ error: "Unauthorized" });
    return
  }
  next();
};