import { sql } from "../database/database.js";

const createQuestion = async (userId, topicId, questionText) => {
  await sql`INSERT INTO questions (user_id, topic_id, question_text) VALUES (${userId}, ${topicId}, ${questionText})`;
}

const getRandomQuestion = async (topicId) => {
  let questions;
  if (topicId) {
    questions = await sql`SELECT * FROM questions WHERE topic_id = ${topicId} ORDER BY RANDOM()`;
  } else {
    questions = await sql`SELECT * FROM questions ORDER BY RANDOM()`;
  }
  if (questions.length > 0) {
    return questions[0];
  }
  return null;
}

const getQuestions = async (topicId) => {
  return await sql`SELECT * FROM questions WHERE topic_id = ${topicId}`;
}

const getQuestion = async (id) => {
  return (await sql`SELECT * FROM questions WHERE id = ${id}`)[0];
}

const getQuestionCount = async () => {
  return (await sql`SELECT COUNT(*) FROM questions`)[0]["count"];
}

const removeQuestion = async (id) => {
  await sql`DELETE FROM questions WHERE id = ${id}`;
}

const removeQuestions = async (topicId) => {
  await sql`DELETE FROM questions WHERE topic_id = ${topicId}`;
}

export { getRandomQuestion, getQuestions, getQuestion, getQuestionCount, createQuestion, removeQuestion, removeQuestions };