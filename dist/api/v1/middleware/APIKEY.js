"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkApiKey = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const validApiKey = process.env.API_KEY;
const checkApiKey = (req, res, next) => {
    const apiKey = req.headers["x-api-key"];
    console.log(validApiKey);
    if (!apiKey || apiKey !== validApiKey) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    next();
};
exports.checkApiKey = checkApiKey;
