const { test, expect } = require("@playwright/test");

const userEmail = "email@email.email";
const userPassword = "password";
const adminEmail = "admin@admin.com";
const adminPassword = "123456";

const registerUser = async (page) => {
  await page.goto("/auth/register");
  await page.getByRole("textbox", { name: "Email address" }).fill(userEmail);
  await page.getByRole("textbox", { name: "Password" }).fill(userPassword);
  await page.getByRole("button", { name: "Submit" }).click();
};

const loginUser = async (page) => {
  await page.goto("/auth/login");
  await page.getByRole("textbox", { name: "Email address" }).fill(userEmail);
  await page.getByRole("textbox", { name: "Password" }).fill(userPassword);
  await page.getByRole("button", { name: "Submit" }).click();
};

const loginAdminUser = async (page) => {
  await page.goto("/auth/login");
  await page.getByRole("textbox", { name: "Email address" }).fill(adminEmail);
  await page.getByRole("textbox", { name: "Password" }).fill(adminPassword);
  await page.getByRole("button", { name: "Submit" }).click();
};

const createTopic = async (page, topicName) => {
  await page.goto("/topics");
  await page.getByRole("textbox", { name: "Name" }).fill(topicName);
  await page.getByRole("button", { name: "Create" }).click();
};

const createQuestion = async (page, topicName, questionName) => {
  await page.goto("/topics");
  await page.getByRole("link", { name: topicName }).click();
  await page.getByRole("textbox", { name: "Question text" }).fill(questionName);
  await page.getByRole("button", { name: "Create" }).click();
};

const createOption = async (page, topicName, questionName, optionName) => {
  await page.goto("/topics");
  await page.getByRole("link", { name: topicName }).click();
  await page.getByRole("link", { name: questionName }).click();
  await page.getByRole("textbox", { name: "Option text" }).fill(optionName);
  await page.getByRole("button", { name: "Create" }).click();
};

test("Registering with too short password shouldn't work", async ({ page }) => {
  await page.goto("/auth/register");
  await page.getByRole("textbox", { name: "Email address" }).fill("email@email.email");
  await page.getByRole("textbox", { name: "Password" }).fill("pas");
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(page).toHaveURL("/auth/register");
});

test("Registering with valid credential credentials should work", async ({ page }) => {
  await registerUser(page);
  await expect(page).toHaveURL("/auth/login");
});

test("Logging in with wrong credentials shouldn't work", async ({ page }) => {
  await page.goto("/auth/login");
  await page.getByRole("textbox", { name: "Email address" }).fill("wrong-email@email.email");
  await page.getByRole("textbox", { name: "Password" }).fill("wrong-password");
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(page).toHaveURL("/auth/login");
});

test("Logging in with right credentials should work", async ({ page }) => {
  await registerUser(page);
  await loginUser(page);
  await expect(page).toHaveURL("/topics");
});

test("Unauthenticated users shouldn't be able to access topics", async ({ page }) => {
  await page.goto("/topics");
  await expect(page).toHaveURL("/auth/login");
});

test("Authenticated users should be able to access topics", async ({ page }) => {
  await registerUser(page);
  await loginUser(page);
  await page.goto("/topics");
  await expect(page).toHaveURL("/topics");
});

test("Topics should be listed on the topics page", async ({ page }) => {
  await loginAdminUser(page);
  const topicName = "Test topic";
  await createTopic(page, topicName);
  await page.goto("/topics");
  const content = await page.content();
  await expect(content).toContain(topicName);
});

test("Normal users shouldn't be able to add topics", async ({ page }) => {
  await registerUser(page);
  await loginUser(page);
  await page.goto("/topics");
  const content = await page.content();
  await expect(content).not.toContain("Create a topic");
});

test("Normal users shouldn't be able to delete topics", async ({ page }) => {
  await registerUser(page);
  await loginUser(page);
  await page.goto("/topics");
  const content = await page.content();
  await expect(content).not.toContain("Delete");
});

test("Normal users should be able to add questions", async ({ page }) => {
  await loginAdminUser(page);
  const topicName = "Test topic";
  await createTopic(page, topicName);
  await registerUser(page);
  await loginUser(page);
  const questionName = "Test question";
  await createQuestion(page, topicName, questionName);
  await page.goto("/topics");
  await page.getByRole("link", { name: topicName }).click();
  const content = await page.content();
  await expect(content).toContain(questionName);
});

test("Normal users should be able to remove questions", async ({ page }) => {
  await loginAdminUser(page);
  const topicName = "Test topic";
  await createTopic(page, topicName);
  await registerUser(page);
  await loginUser(page);
  const questionName = "Test question";
  await createQuestion(page, topicName, questionName);
  await page.goto("/topics");
  await page.getByRole("link", { name: topicName }).click();
  await page.getByRole("link", { name: questionName }).click();
  await page.getByRole("button", { name: "Delete question" }).click();
  await page.goto("/topics");
  await page.getByRole("link", { name: topicName }).click();
  const content = await page.content();
  await expect(content).not.toContain(questionName);
});

test("Normal users should be able to add answer options", async ({ page }) => {
  await loginAdminUser(page);
  const topicName = "Test topic";
  await createTopic(page, topicName);
  await registerUser(page);
  await loginUser(page);
  const questionName = "Test question";
  await createQuestion(page, topicName, questionName);
  const optionName = "Test option";
  await createOption(page, topicName, questionName, optionName);
  await page.goto("/topics");
  await page.getByRole("link", { name: topicName }).click();
  await page.getByRole("link", { name: questionName }).click();
  const content = await page.content();
  await expect(content).toContain(optionName);
});

test("Normal users should be able to remove answer options", async ({ page }) => {
  await loginAdminUser(page);
  const topicName = "Test topic";
  await createTopic(page, topicName);
  await registerUser(page);
  await loginUser(page);
  const questionName = "Test question";
  await createQuestion(page, topicName, questionName);
  const optionName = "Test option";
  await createOption(page, topicName, questionName, optionName);
  await page.goto("/topics");
  await page.getByRole("link", { name: topicName }).click();
  await page.getByRole("link", { name: questionName }).click();
  await page.getByRole("button", { name: "Delete option" }).click();
  await page.goto("/topics");
  await page.getByRole("link", { name: topicName }).click();
  await page.getByRole("link", { name: questionName }).click();
  const content = await page.content();
  await expect(content).not.toContain(optionName);
});

test("Unauthenticated users shouldn't be able to access quizes", async ({ page }) => {
  await page.goto("/quiz");
  await expect(page).toHaveURL("/auth/login");
});
