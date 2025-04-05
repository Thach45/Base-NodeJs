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

    async function main() {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });
      console.log(response.text);
      res.status(200).json({ message: response.text });
    }

    main();

    const newMesseage = await Message.create({
      user: id,
      message: prompt,
    });
    const messages = await Message.find({ user: id }).lean();
    let chat = "";
    for (const message of messages) {
      chat += message.message + ", ";
    }

    async function anlyze() {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: `Analyze the emotional tone of this message and return a score between 0 (neutral) and 100 (extremely negative):
"${chat}"

Return only a JSON object in this format:
{"level": "50"}`
        });

        // Đảm bảo response.text tồn tại và là string
        if (!response.text) {
          console.log('Empty response from AI');
          return { level: "50" };
        }

        let jsonStr = response.text.trim();
        
        // Xử lý trường hợp AI trả về số trực tiếp
        if (!isNaN(Number(jsonStr))) {
          return { level: jsonStr };
        }

        // Tìm và trích xuất đối tượng JSON từ văn bản
        const jsonMatch = jsonStr.match(/\{[^}]+\}/);
        if (jsonMatch) {
          jsonStr = jsonMatch[0];
        } else {
          console.log('No JSON object found in response');
          return { level: "50" };
        }

        try {
          const moodAnalysis = JSON.parse(jsonStr);
          // Kiểm tra xem level có tồn tại và hợp lệ không
          if (!moodAnalysis.level || isNaN(Number(moodAnalysis.level))) {
            console.log('Invalid level value in response');
            return { level: "50" };
          }
          return moodAnalysis;
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          return { level: "50" }; // Giá trị mặc định nếu parse lỗi
        }
      } catch (error) {
        console.error('Analysis error:', error);
        return { level: "50" }; // Giá trị mặc định nếu có lỗi
      }
    }

    const data = await anlyze();
    const ngay = new Date();
    const ngayThang = `${String(ngay.getDate()).padStart(2, '0')}/${String(ngay.getMonth() + 1).padStart(2, '0')}`;
    let { level } = data;
    level = parseInt(level);
    console.log('Analyzed level:', level);
    
    const newAnlyze = await Anlyze.create({
      ngayThang,
      level,
      user: id,
    });

  } catch (error) {
    console.error('Generate message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllAnlyze = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const messages = await Anlyze.find({ user: id }).lean();
    res.status(200).json(messages);
  } catch (error) {
    console.error('Get analyze error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




