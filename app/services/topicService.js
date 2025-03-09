import { sql } from "../database/database.js";

const createTopic = async (name, userId) => {
  await sql`INSERT INTO topics (name, user_id) VALUES (${name}, ${userId})`;
}

const getTopic = async (id) => {
  return (await sql`SELECT * FROM topics WHERE id = ${id}`)[0];
}

const getTopicCount = async () => {
  return (await sql`SELECT COUNT(*) FROM topics`)[0]["count"];
}

const getTopics = async () => {
  return await sql`SELECT * FROM topics ORDER BY name`;
}

const removeTopic = async (id) => {
  await sql`DELETE FROM topics WHERE id = ${id}`;
}

export { getTopic, getTopics, getTopicCount, createTopic, removeTopic };