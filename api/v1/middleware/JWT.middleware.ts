import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

// Extend Express Request type to include user property
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

dotenv.config();
export const  verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers["token"];
    
    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const tokenString = Array.isArray(token) ? token[0] : token;
    const accessToken = tokenString.split(" ")[1];
    jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN as string, (err, user) => {
        if (err) {
            res.status(403).json({ message: "Forbidden" });
            return;
        }
        req.user = user;
        
        next();
    });
}

export const verifyTokenAdmin = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers["token"];
    
    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const tokenString = Array.isArray(token) ? token[0] : token;
    const accessToken = tokenString.split(" ")[1];
    console.log(accessToken);
    jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN as string, (err, user) => {
        if (err) {
            res.status(403).json({ message: "Forbidden" });
            return;
        }
        req.user = user;
        if (req.user.role !== 'admin') {
            res.status(403).json({ message: "Forbidden" });
            return;
        }
        next();
    });
}