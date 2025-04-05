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
exports.analyzeParagraph = void 0;
const genai_1 = require("@google/genai");
const dotenv_1 = __importDefault(require("dotenv"));
const user_model_1 = __importDefault(require("../../../model/user.model"));
dotenv_1.default.config();
const analyzeParagraph = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { prompt, id } = req.body;
    const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
    function main() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: "tôi đang bị các triệu chứng như đoạn prompt " + prompt + " tôi muốn bạn phân tích xem tôi có đang mắc bệnh trầm cảm hay không"
            });
            console.log(response.text);
            res.status(200).json({ message: response.text });
        });
    }
    main();
    const updateUser = yield user_model_1.default.findByIdAndUpdate(id, { isSurvey: true });
    if (!updateUser) {
        res.status(404).json({ message: "User not found" });
    }
});
exports.analyzeParagraph = analyzeParagraph;
