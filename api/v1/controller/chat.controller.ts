import { GoogleGenAI } from "@google/genai";
import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

export const generateMessage = async (req: Request, res: Response) => {
  const { prompt } = req.body;

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
  
};