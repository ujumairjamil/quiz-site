import { validasaur } from "../../deps.js";
import { getData } from "../../utilities.js";
import * as answerService from "../../services/answerService.js";
import * as answerOptionService from "../../services/answerOptionService.js";
import * as questionService from "../../services/questionService.js";

const addAnswerOption = async ({ request, response, render, params }) => {
  const validationRules = {
    option_text: [validasaur.required, validasaur.minLength(1)],
  };
  const data = await getData(request);
  data.is_correct = data.hasOwnProperty("is_correct");
  let [passes, errors] = await validasaur.validate(data, validationRules);

  if (passes) {
    answerOptionService.createAnswerOption(params.questionId, data.option_text, data.is_correct);
    response.redirect(`/topics/${params.topicId}/questions/${params.questionId}`);
  } else {
    const options = await answerOptionService.getAnswerOptions(params.questionId);
    const question = await questionService.getQuestion(params.questionId);
    render("question.eta", { errors: errors, option_text: data.option_text, is_correct: data.is_correct, options: options, question: question });
  }
};

const deleteAnswerOption = async ({ params, response }) => {
  await answerService.removeOptionAnswers(params.optionId);
  await answerOptionService.removeAnswerOption(params.optionId);
  response.redirect(`/topics/${params.topicId}/questions/${params.questionId}`);
};

export { addAnswerOption, deleteAnswerOption };