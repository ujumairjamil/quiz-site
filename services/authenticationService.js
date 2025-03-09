import { sql } from "../database/database.js";

const addUser = async (email, passwordHash) => {
  await sql`INSERT INTO users (email, password) VALUES (${email}, ${passwordHash})`;
}

const getExistingUser = async (email) => {
  const users = await sql`SELECT * FROM users WHERE email = ${email}`;
  if (users.length) {
    return users[0];
  }
  return null;
}

export { addUser, getExistingUser };