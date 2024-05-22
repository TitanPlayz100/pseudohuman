import { cohereAI as cohere, geminiAI as gemini } from '../server.js';
import { fetchDataFiltered, insertData, updateData } from '../database/dbInterface.js';
import { modifiers, prompts } from '../answers.js';

async function askCohere(question) {
    const prompt = question;
    const result = await cohere.generate({ prompt: prompt });
    const answer = result.generations[0]['text'].replace('\n', ' ');
    return answer;
}

async function askGemini(question) {
    const prompt = question;
    try {
        const result = await gemini.generateContent(prompt);
        const answer = result.response.text().replace('\n', ' ');
        return answer;
    } catch (error) {
        return false;
    }
}

// a bunch of one time functions that run to do various things
// like generate ai answers and store/fix the answers to database
async function newQuestion(question, question_id, ai_answers, modifierIndex) {
    const info = { question };
    info['ai_answers_' + modifierIndex] = ai_answers;
    return await updateData('PromptsTable', [info], 'id', question_id);
}

async function appendAnswer(question, ai_answers_new) {
    const data = await fetchDataFiltered('PromptsTable', '*', 'question', question);
    if (!data) return false;
    let { ai_answers } = data[0];
    ai_answers = [...ai_answers, ...ai_answers_new];
    return await updateData('PromptsTable', [{ ai_answers }], 'question', question);
}

async function generate() {
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

            if (!answer || !answer2) {
                console.error(index + ' failed');
                continue;
            }

            await newQuestion(question, id, [answer, answer2], modifierIndex);
            console.info(`modifier ${modifierIndex}, question ${index} out of ${max}`);
            await new Promise(resolve => setTimeout(resolve, 6000));
            modifierIndex++;
        }
        index++;
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

async function fixQuestions() {
    const qBank = prompts;
    for (let info of qBank) {
        const { id, question } = info;
        await updateData('PromptsTable', [{ question }], 'id', id);
    }
}
