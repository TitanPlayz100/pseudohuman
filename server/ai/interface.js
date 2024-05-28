import { fetchDataFiltered, updateData } from '../database/dbInterface.js';
import { modifiers, prompts } from '../answers.js';
import { CohereClient } from 'cohere-ai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import env from 'dotenv';
env.config();

const cohereAI = new CohereClient({ token: process.env.AI_API_KEY });
const geminiAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY).getGenerativeModel({ model: 'gemini-pro' });

// a bunch of one time functions that run to do various things
// like generate ai answers and store/fix the answers to database

// AI interfaces
async function askCohere(question) {
    const prompt = question;
    const result = await cohereAI.generate({ prompt: prompt });
    const answer = result.generations[0]['text'].replace('\n', ' ');
    return answer;
}

async function askGemini(question) {
    const prompt = question;
    try {
        const result = await geminiAI.generateContent(prompt);
        const answer = result.response.text().replace('\n', ' ');
        return answer;
    } catch (error) {
        return false;
    }
}

// Storing answer into new record
async function newQuestion(question, question_id, ai_answers, modifierIndex) {
    const info = { question };
    info['ai_answers_' + modifierIndex] = ai_answers;
    return await updateData('PromptsTable', [info], 'id', question_id);
}

// Appending answer into existing record
async function appendAnswer(question, ai_answers_new) {
    // first fetch answers, then append new answer to it
    const data = await fetchDataFiltered('PromptsTable', '*', 'question', question);
    if (!data) return false;
    let { ai_answers } = data[0];
    ai_answers = [...ai_answers, ...ai_answers_new];
    return await updateData('PromptsTable', [{ ai_answers }], 'question', question);
}

// Generating new responses using AI (added delay)
async function generateAndStoreAIAnswers() {
    const questionBank = prompts;
    const modifierBank = modifiers;
    let index = 1;
    const max = questionBank.length;
    for (let info of questionBank) {
        let modifierIndex = 1;
        for (let modifier of modifierBank) {
            const { question, id } = info;
            const answer = await askCohere(question + '? ' + modifier);
            const answer2 = await askGemini(question + '? ' + modifier);

            // if answer is blank then skip
            if (!answer || !answer2) {
                console.error(index + ' failed');
                continue;
            }

            await newQuestion(question, id, [answer, answer2], modifierIndex);
            console.info(`modifier ${modifierIndex}, question ${index} out of ${max}`);

            // added delay to bypass rate limit
            await new Promise(resolve => setTimeout(resolve, 6000));
            modifierIndex++;
        }
        index++;
    }
}

// Some questions from the riddle API
async function getQuestions() {
    let questions = [];
    for (let i = 0; i < 20; i++) {
        const response = await fetch('https://riddles-api.vercel.app/random');
        const data = await response.json();
        questions.push(data.riddle);
    }
    return questions;
}
