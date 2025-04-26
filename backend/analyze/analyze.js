import { Router } from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
const router = Router();
const PROMPT = `Given this json file containing snippets of various emails from primary inbox, I want you to sort them based on which email requires priortized action. 
I want the output as an object which should have :-

Key 'Priority' should be a list of ids sorted based on their priority.

Key 'VeryImportant' should contain a list containing ids of those email snippets which require the urgent action.

Key 'Important' should contain a list containing ids of those email snippets which require not that urgent action.

Key 'Ordinary' should contain a list containing ids of those email snippets which require the least urgent action.

Key 'Summary' should contain an atleast 100 words or more summary by reading all the snippets indicating the type of emails provided. 

Key 'Emails' should contain the list of all the email snippets along with their ids in the same format as provided.

The output should be in such a way that it can be directly be converted to a json object.
`;

router.post("/analyze", async (req, res) => {
  const content = fs.readFileSync("email-cache.json", "utf8");
  //console.log(content);
  if (content) {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: PROMPT + content,
    });
    let result = response.text.substring(8, response.text.length - 4);

    fs.writeFileSync("ai-cache.txt.json", result, "utf8");
    return res.json(JSON.parse(result));
  } else {
    res.json("File not found or empty.");
  }
});
export { router as analyzeRouter };
