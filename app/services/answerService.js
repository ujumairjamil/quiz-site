import { sql } from "../database/database.js";

const addAnswer = async (userId, questionId, optionId) => {
  return await sql`INSERT INTO question_answers
   (user_id, question_id, question_answer_option_id) VALUES (${userId}, ${questionId}, ${optionId})`;
}

const getAnswerCount = async () => {
  return (await sql`SELECT COUNT(*) FROM question_answers`)[0]["count"];
}

const removeOptionAnswers = async (optionId) => {
  await sql`DELETE FROM question_answers WHERE question_answer_option_id = ${optionId}`;
}

const removeTopicAnswers = async (topicId) => {
  await sql`DELETE FROM question_answers
    WHERE question_answers.question_id IN (
      SELECT id FROM questions WHERE topic_id = ${topicId}
    )
  `;
}

export { addAnswer, getAnswerCount, removeOptionAnswers, removeTopicAnswers };
