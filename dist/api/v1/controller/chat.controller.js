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
exports.generateMessage = void 0;
const genai_1 = require("@google/genai");
const dotenv_1 = __importDefault(require("dotenv"));
const message_model_1 = __importDefault(require("../../../model/message.model"));
const anlyze_model_1 = __importDefault(require("../../../model/anlyze.model"));
dotenv_1.default.config();
const generateMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { prompt, id } = req.body;
    const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
    function main() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: prompt,
            });
            console.log(response.text);
            res.status(200).json({ message: response.text });
        });
    }
    main();
    const newMesseage = yield message_model_1.default.create({
        user: id,
        message: prompt,
    });
    const messages = yield message_model_1.default.find({ user: id }).lean();
    let chat = "'";
    for (const message of messages) {
        chat += message.message + ", ";
    }
    chat += "'";
    function anlyze() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: `I am treating a patient with depression, the patient texted me but the following message: ${chat}. 
      Please analyze the text and return only the following in this exact format:
       {"level": "0-100"} Do not include any additional explanations or details.`
            });
            const moodAnalysis = JSON.parse(response.text);
            return moodAnalysis;
        });
    }
    const data = yield anlyze();
    const ngay = new Date();
    const ngayThang = `${String(ngay.getDate()).padStart(2, '0')}/${String(ngay.getMonth() + 1).padStart(2, '0')}`;
    const { level, mood } = data;
    console.log(data);
    const newAnlyze = yield anlyze_model_1.default.create({
        ngayThang,
        level,
        mood,
        user: id,
    });
    console.log(newAnlyze);
});
exports.generateMessage = generateMessage;
