import { GoogleGenAI } from "@google/genai";
import { Request, Response } from "express";
import dotenv from "dotenv";
import User from "../../../model/user.model";
dotenv.config();

export const analyzeParagraph = async (req: Request, res: Response) => {
  const { prompt, id } = req.body;

  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

  async function main() {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "tôi đang bị các triệu chứng như đoạn prompt " +prompt+" tôi muốn bạn phân tích xem tôi có đang mắc bệnh trầm cảm hay không"
    });
    console.log(response.text);
    res.status(200).json({ message: response.text });
  }

  main();
  const updateUser = await User.findByIdAndUpdate(
    id,
    { isSurvey: true }
  );
  if (!updateUser) {
     res.status(404).json({ message: "User not found" });
  }
}