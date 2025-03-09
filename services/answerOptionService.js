import { sql } from "../database/database.js";

const createAnswerOption = async (questionId, optionText, isCorrect) => {
  await sql`INSERT INTO question_answer_options (question_id, option_text, is_correct) VALUES (${questionId}, ${optionText}, ${isCorrect})`;
}

const getAnswerOption = async (id, questionId) => {
  return (await sql`SELECT * FROM question_answer_options WHERE id = ${id} AND question_id = ${questionId}`)[0];
}

const getAnswerOptions = async (questionId) => {
  return await sql`SELECT * FROM question_answer_options WHERE question_id = ${questionId}`;
}

const getCorrectAnswerOption = async (questionId) => {
  const options = await sql`SELECT * FROM question_answer_options WHERE question_id = ${questionId} AND is_correct`;
  if (options.length > 0) {
    return options[0];
  }
  return null;
}

const removeAnswerOption = async (id) => {
  await sql`DELETE FROM question_answer_options WHERE id = ${id}`;
}

const removeAnswerOptions = async (topicId) => {
  await sql`DELETE FROM question_answer_options
    WHERE question_answer_options.question_id IN (
      SELECT id FROM questions WHERE topic_id = ${topicId}
    )
  `;
}

export {
  getAnswerOption,
  getAnswerOptions,
  createAnswerOption,
  getCorrectAnswerOption,
  removeAnswerOption,
  removeAnswerOptions,
};