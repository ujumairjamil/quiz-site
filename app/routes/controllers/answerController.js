import * as answerService from "../../services/answerService.js";
import * as answerOptionService from "../../services/answerOptionService.js";

const checkAnswer = async ({ params, response, state }) => {
  const user = await state.session.get('user');
  await answerService.addAnswer(user.id, params.questionId, params.optionId);
  const option = await answerOptionService.getAnswerOption(params.optionId, params.questionId);
  let redirectUrl;
  if (option.is_correct) {
    redirectUrl = `/quiz/${params.topicId}/questions/${params.questionId}/correct`;
  } else {
    redirectUrl = `/quiz/${params.topicId}/questions/${params.questionId}/incorrect`;
  }
  response.redirect(redirectUrl);
};

const correctAnswer = async ({ params, render }) => {
  render("correctAnswer.eta", { topicId: params.topicId });
};

const incorrectAnswer = async ({ params, render }) => {
  const correctOption = await answerOptionService.getCorrectAnswerOption(params.questionId);
  render("incorrectAnswer.eta", { topicId: params.topicId, correctOption: correctOption });
};

export { checkAnswer, correctAnswer, incorrectAnswer };