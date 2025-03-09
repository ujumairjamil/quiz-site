import { validasaur } from "../../deps.js";
import { getData } from "../../utilities.js";
import * as answerService from "../../services/answerService.js";
import * as answerOptionService from "../../services/answerOptionService.js";
import * as questionService from "../../services/questionService.js";
import * as topicService from "../../services/topicService.js";

const addTopic = async ({ request, response, render, state }) => {
  const user = await state.session.get('user');
  if (!user.admin) {
    response.status = 403;
    return;
  }

  const validationRules = {
    name: [validasaur.required, validasaur.minLength(1)],
  };
  const data = await getData(request);
  let [passes, errors] = await validasaur.validate(data, validationRules);

  if (passes) {
    const user = await state.session.get('user');
    topicService.createTopic(data.name, user.id);
    response.redirect("/topics");
  } else {
    const topics = await topicService.getTopics();
    render("topicList.eta", { errors: errors, name: data.name, topics: topics });
  }
};

const deleteTopic = async ({ params, response, state }) => {
  const user = await state.session.get('user');
  if (!user.admin) {
    response.status = 403;
    return;
  }
  await answerService.removeTopicAnswers(params.topicId);
  await answerOptionService.removeAnswerOptions(params.topicId);
  await questionService.removeQuestions(params.topicId);
  await topicService.removeTopic(params.topicId);
  response.redirect("/topics");
};

const showTopics = async ({ render }) => {
  const topics = await topicService.getTopics();
  render("topicList.eta", { topics: topics });
};

const showQuizTopics = async ({ render }) => {
  const topics = await topicService.getTopics();
  render("quizTopicList.eta", { topics: topics });
};

const chooseRandomQuestion = async ({ params, render, response }) => {
  const question = await questionService.getRandomQuestion(params.topicId);
  if (question) {
    response.redirect(`/quiz/${params.topicId}/questions/${question.id}`);
  } else {
    const topics = await topicService.getTopics();
    render("quizTopicList.eta", { topics: topics, error: "There are no questions for the selected topic." });
  }
};

export { addTopic, deleteTopic, showTopics, showQuizTopics, chooseRandomQuestion };