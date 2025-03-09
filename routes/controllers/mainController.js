import * as answerService from "../../services/answerService.js";
import * as questionService from "../../services/questionService.js";
import * as topicService from "../../services/topicService.js";

const showMain = async ({ render }) => {
  const topicCount = await topicService.getTopicCount();
  const questionCount = await questionService.getQuestionCount();
  const answerCount = await answerService.getAnswerCount();
  render(
    "main.eta",
    { topicCount: topicCount, questionCount: questionCount, answerCount: answerCount }
  );
};

export { showMain };
