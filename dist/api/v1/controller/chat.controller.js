"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAnlyze = exports.generateMessage = void 0;
const genai_1 = require("@google/genai");
const dotenv_1 = __importDefault(require("dotenv"));
const message_model_1 = __importDefault(require("../../../model/message.model"));
const anlyze_model_1 = __importDefault(require("../../../model/anlyze.model"));
dotenv_1.default.config();
const generateMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { prompt, id } = req.body;
        const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
        yield message_model_1.default.create({ user: id, message: prompt });
        const messages = yield message_model_1.default.find({ user: id }).lean();
        let chat = messages.map(m => m.message).join(", ");
        const reply = yield ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt
        });
        const aiMessage = reply.text || "Xin lỗi, mình không hiểu ý bạn.";
        const analyzePrompt = `You are a mental health assistant helping a therapist analyze patient messages for emotional distress.

The therapist received the following message from a patient dealing with depression:
"${chat}"

Your task is to analyze the emotional tone of this message and return a single score between 0 (completely neutral) and 100 (extremely negative).

Respond strictly in this JSON format (no extra text or explanation):
{"level": "0-100"}`;
        const analysisResponse = yield ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: analyzePrompt
        });
        const rawText = analysisResponse.text;
        const match = rawText.match(/{\s*"level"\s*:\s*"\d{1,3}"\s*}/);
        if (!match) {
            throw new Error("Phân tích cảm xúc trả về sai định dạng JSON");
        }
        const { level } = JSON.parse(match[0]);
        const levelNumber = parseInt(level);
        const now = new Date();
        const ngayThang = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}`;
        yield anlyze_model_1.default.create({
            user: id,
            level: levelNumber,
            ngayThang,
        });
        res.status(200).json({
            message: aiMessage,
            level: levelNumber,
            ngayThang
        });
    }
    catch (error) {
        console.error("Error in generateMessage:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.generateMessage = generateMessage;
const getAllAnlyze = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const messages = yield anlyze_model_1.default.find({ user: id }).lean();
    res.status(200).json(messages);
});
exports.getAllAnlyze = getAllAnlyze;
