import { validasaur } from "../../deps.js";
import { getData } from "../../utilities.js";
import * as answerOptionService from "../../services/answerOptionService.js";
import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";

const addQuestion = async ({ params, request, response, render, state }) => {
  const validationRules = {
    question_text: [validasaur.required, validasaur.minLength(1)],
  };
  const data = await getData(request);
  let [passes, errors] = await validasaur.validate(data, validationRules);

  if (passes) {
    const user = await state.session.get('user');
    await questionService.createQuestion(user.id, params.topicId, data.question_text);
    response.redirect(`/topics/${params.topicId}`);
  } else {
    const questions = await questionService.getQuestions(params.topicId);
    const topic = await topicService.getTopic(params.topicId);
    render(
      "questionList.eta",
      { errors: errors, name: data.question_text, questions: questions, topic: topic }
    );
  }
};

const deleteQuestion = async ({ params, response }) => {
  questionService.removeQuestion(params.questionId);
  response.redirect(`/topics/${params.topicId}`);
};

const showQuestions = async ({ params, render }) => {
  const questions = await questionService.getQuestions(params.topicId);
  const topic = await topicService.getTopic(params.topicId);
  render("questionList.eta", { questions: questions, topic: topic });
};

const showQuestion = async ({ params, render }) => {
  const options = await answerOptionService.getAnswerOptions(params.questionId);
  const question = await questionService.getQuestion(params.questionId);
  render("question.eta", { options: options, question: question, topicId: params.topicId });
};

const showQuizQuestion = async ({ params, render }) => {
  const options = await answerOptionService.getAnswerOptions(params.questionId);
  const question = await questionService.getQuestion(params.questionId);
  render("quizQuestion.eta", { options: options, question: question, topicId: params.topicId });
};

export { addQuestion, deleteQuestion, showQuestions, showQuestion, showQuizQuestion };