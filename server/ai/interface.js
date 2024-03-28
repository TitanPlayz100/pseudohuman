import { cohereAI as cohere, geminiAI as gemini } from "../server.js";
import { fetchDataFiltered, insertData, updateData } from "../database/dbInterface.js";

export async function getAIanswerCohere(question) {
    const prompt = question + '. Answer in one line and maximum 25 words.';
    const result = await cohere.generate({ prompt: prompt });
    const answer = result.generations[0]['text'].replace('\n', ' ');
    return answer
}

export async function getAIanswerGemini(question) {
    const prompt = question
    const result = await gemini.generateContent(prompt + '. Answer in one line and maximum 25 words.');
    const answer = result.response.text().replace('\n', ' ');
    return answer;
}

export async function addNewQuestion(question, ai_answers) {
    return await insertData('PromptsTable', [{ question, ai_answers }])
}

export async function addAnswer(question, ai_answers_new) {
    const data = await fetchDataFiltered('PromptsTable', '*', 'question', question)
    if (!data) return false;
    let { ai_answers } = data[0];
    ai_answers = [...ai_answers, ...ai_answers_new]
    return await updateData('PromptsTable', [{ ai_answers }], 'question', question)
}

const questions = [
    "What is chemistry",
    "What is physics",
    "What is quantum mechanics",
    "How would you survive a zombie apocyypse",
    "What are some good last words to have",
    "What is the worst consiracy theory you know",
    "What is the best way to spend 1 million dollars",
    "What are some good Netflix shows to watch",
    "Do aliens exist",
    "What is the funniest joke you know",
    "Recommend the best password you know",
    "Suppose time travel was real, what would be the best year to time travel to",
    "Best social media platform",
    "What does the word 'ok' mean for you",
    "What is the worst name a kid could have",
    "What would people be nostalgic of in 500 years from now",
    "Google en passant",
    "Would you lose",
    "What is 9 + 10",
];

export async function generate() {
    for (let question of questions) {

        const answer = await getAIanswerCohere(question);
        const answer2 = await getAIanswerGemini(question);

        await addNewQuestion(question, [answer, answer2]);
        console.log('added new answers');
        await new Promise(resolve => setTimeout(resolve, 6000));
    }
}
// await generate();
