import { cohereAI as cohere, geminiAI as gemini } from "../server.js";
import { fetchDataFiltered, insertData, updateData } from "../database/dbInterface.js";

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

export async function addNewQuestion(question, ai_answers, user_answers) {
    return await insertData('PromptsTable', [{ question, ai_answers, user_answers }])
}

export async function addAnswer(question, ai_answers_new, user_answers_new) {
    const data = await fetchDataFiltered('PromptsTable', '*', 'question', question)
    if (!data) return false;
    let { ai_answers, user_answers } = data[0];
    ai_answers = [...ai_answers, ...ai_answers_new]
    user_answers = [...user_answers, ...user_answers_new]
    const response = await updateData('PromptsTable', [{ ai_answers }], 'question', question)
    const response2 = await updateData('PromptsTable', [{ user_answers }], 'question', question)
    return [response, response2]
}