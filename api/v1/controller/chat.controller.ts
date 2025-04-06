import { GoogleGenAI } from "@google/genai";
import { Request, Response } from "express";
import dotenv from "dotenv";
import Message from "../../../model/message.model";
import Anlyze from "../../../model/anlyze.model";
dotenv.config();

export const generateMessage = async (req: Request, res: Response) => {
  try {
    const { prompt, id } = req.body;
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

    // 1. Tạo message mới
    await Message.create({ user: id, message: prompt });

    // 2. Lấy toàn bộ message của user
    const messages = await Message.find({ user: id }).lean();
    let chat = messages.map(m => m.message).join(", ");

    // 3. Gửi prompt tới AI để sinh phản hồi
    const reply = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt
    });

    const aiMessage = reply.text || "Xin lỗi, mình không hiểu ý bạn.";

    // 4. Gửi prompt tới AI để phân tích cảm xúc
    const analyzePrompt = `You are a mental health assistant helping a therapist analyze patient messages for emotional distress.

The therapist received the following message from a patient dealing with depression:
"${chat}"

Your task is to analyze the emotional tone of this message and return a single score between 0 (completely neutral) and 100 (extremely negative).

Respond strictly in this JSON format (no extra text or explanation):
{"level": "0-100"}`;

    const analysisResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: analyzePrompt
    });

    // 5. Xử lý JSON trả về
    const rawText = analysisResponse.text!;
    const match = rawText.match(/{\s*"level"\s*:\s*"\d{1,3}"\s*}/);

    if (!match) {
      throw new Error("Phân tích cảm xúc trả về sai định dạng JSON");
    }

    const { level } = JSON.parse(match[0]);
    const levelNumber = parseInt(level);

    // 6. Lưu vào DB
    const now = new Date();
    const ngayThang = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}`;

    await Anlyze.create({
      user: id,
      level: levelNumber,
      ngayThang,
    });

    // 7. Trả về kết quả
    res.status(200).json({
      message: aiMessage,
      level: levelNumber,
      ngayThang
    });

  } catch (error) {
    console.error("Error in generateMessage:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getAllAnlyze = async (req: Request, res: Response) => {
  const { id } = req.body;
  const messages = await Anlyze.find({ user: id }).lean();
  res.status(200).json(messages);
};




