import { CohereClient } from "cohere-ai";
import env from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";
env.config();

const cohere = new CohereClient({ token: process.env.AI_API_KEY });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
const gemini = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function getAIanswerCohere(question) {
    const prompt = question + '? Answer in one line.';
    const result = await cohere.generate({ prompt: prompt });
    const answer = result.generations[0]['text'].replace('\n', ' ');
    return answer
}

export async function getAIanswerGemini(question) {
    const prompt = question
    const result = await gemini.generateContent(prompt + '? Answer in one line.');
    const answer = result.response.text().replace('\n', ' ');
    return answer;
}

// console.log(await getAIanswerGemini('If you could recommend a colour, what would it be'));
// console.log(await getAIanswerCohere('If you could recommend a colour, what would it be'));

