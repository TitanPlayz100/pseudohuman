import { cohereAI as cohere, geminiAI as gemini } from '../server.js';
import { fetchDataFiltered, insertData, updateData } from '../database/dbInterface.js';

async function askCohere(question) {
    const prompt = question + '. Answer in one line and maximum 25 words.';
    const result = await cohere.generate({ prompt: prompt });
    const answer = result.generations[0]['text'].replace('\n', ' ');
    return answer;
}

async function askGemini(question) {
    const prompt = question;
    try {
        const result = await gemini.generateContent(prompt + '. Answer in one line and maximum 25 words.');
        const answer = result.response.text().replace('\n', ' ');
        return answer;
    } catch (error) {
        return false;
    }
}

async function newQuestion(question, ai_answers) {
    return await insertData('PromptsTable', [{ question, ai_answers }]);
}

async function appendAnswer(question, ai_answers_new) {
    const data = await fetchDataFiltered('PromptsTable', '*', 'question', question);
    if (!data) return false;
    let { ai_answers } = data[0];
    ai_answers = [...ai_answers, ...ai_answers_new];
    return await updateData('PromptsTable', [{ ai_answers }], 'question', question);
}

async function generate() {
    const questions = [...questionsNew];
    let index = 1;
    const max = questions.length;
    for (let question of questions) {
        const answer = await askCohere(question);
        const answer2 = await askGemini(question);
        index++;

        if (!answer || !answer2) {
            console.error(index + ' failed');
            continue;
        }

        await newQuestion(question, [answer, answer2]);
        console.log(index + ' out of ' + max);
        await new Promise(resolve => setTimeout(resolve, 6000));
    }
}

async function getQuestions() {
    let questions = [];
    for (let i = 0; i < 20; i++) {
        const response = await fetch('https://riddles-api.vercel.app/random');
        const data = await response.json();
        questions.push(data.riddle);
    }
    return questions;
}

const questionsNew = [];
