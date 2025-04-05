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
      contents: `I am treating a patient with depression, the patient texted me but the following message: ${chat}. 
      Please analyze the text and return only the following in this exact format:
       {"level": "0-100"} Do not include any additional explanations or details.`
    });
    const moodAnalysis = JSON.parse(response.text!);
    return moodAnalysis;
  }

  const data = await anlyze();
  const ngay = new Date();
  const ngayThang = `${String(ngay.getDate()).padStart(2, '0')}/${String(ngay.getMonth() + 1).padStart(2, '0')}`;
  const {level, mood} = data;
  console.log(data);
  const newAnlyze = await Anlyze.create({
    ngayThang,
    level,
    mood,
    user: id,
  
});
console.log(newAnlyze);
}



