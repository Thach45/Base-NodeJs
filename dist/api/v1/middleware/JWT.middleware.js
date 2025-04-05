"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenAdmin = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const verifyToken = (req, res, next) => {
    const token = req.headers["token"];
    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const tokenString = Array.isArray(token) ? token[0] : token;
    const accessToken = tokenString.split(" ")[1];
    jsonwebtoken_1.default.verify(accessToken, process.env.JWT_ACCESS_TOKEN, (err, user) => {
        if (err) {
            res.status(403).json({ message: "Forbidden" });
            return;
        }
        req.user = user;
        next();
    });
};
exports.verifyToken = verifyToken;
const verifyTokenAdmin = (req, res, next) => {
    const token = req.headers["token"];
    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const tokenString = Array.isArray(token) ? token[0] : token;
    const accessToken = tokenString.split(" ")[1];
    console.log(accessToken);
    jsonwebtoken_1.default.verify(accessToken, process.env.JWT_ACCESS_TOKEN, (err, user) => {
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
};
exports.verifyTokenAdmin = verifyTokenAdmin;
