import { GoogleGenAI } from "@google/genai";
import { Request, Response } from "express";
import dotenv from "dotenv";
import Message from "../../../model/message.model";
import Anlyze from "../../../model/anlyze.model";
dotenv.config();

export const generateMessage = async (req: Request, res: Response) => {
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
  let chat ="'";
  for (const message of messages) {
    chat += message.message + ", ";
  }
  chat += "'";
  async function anlyze() {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `You are a mental health assistant helping a therapist analyze patient messages for emotional distress.

The therapist received the following message from a patient dealing with depression:
"${chat}"

Your task is to analyze the emotional tone of this message and return a single score between 0 (completely neutral) and 100 (extremely negative).

Respond strictly in this JSON format (no extra text or explanation):
{"level": "0-100"}`
    });
    const moodAnalysis = JSON.parse(response.text!);
    return moodAnalysis;
  }

  const data = await anlyze();
  const ngay = new Date();
  const ngayThang = `${String(ngay.getDate()).padStart(2, '0')}/${String(ngay.getMonth() + 1).padStart(2, '0')}`;
  let {level} = data;
  level = parseInt(level);
  console.log(level);
  const newAnlyze = await Anlyze.create({
    ngayThang,
    level,
    user: id,
  
});

}

export const getAllAnlyze = async (req: Request, res: Response) => {
  const { id } = req.body;
  const messages = await Anlyze.find({ user: id }).lean();
  res.status(200).json(messages);
};




