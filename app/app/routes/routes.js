import { Router } from "../deps.js";
import * as answerController from "./controllers/answerController.js";
import * as answerOptionController from "./controllers/answerOptionController.js";
import * as authenticationController from "./controllers/authenticationController.js";
import * as mainController from "./controllers/mainController.js";
import * as questionController from "./controllers/questionController.js";
import * as topicController from "./controllers/topicController.js";

const router = new Router();

router.get("/", mainController.showMain);

router.get("/auth/login", authenticationController.showLogin);
router.post("/auth/login", authenticationController.validateLogin);
router.get("/auth/register", authenticationController.showRegistration);
router.post("/auth/register", authenticationController.validateRegistration);
router.get("/auth/logout", authenticationController.logout);

router.get("/topics", topicController.showTopics);
router.post("/topics", topicController.addTopic);
router.get("/topics/:topicId", questionController.showQuestions);
router.post("/topics/:topicId/delete", topicController.deleteTopic);
router.post("/topics/:topicId/questions", questionController.addQuestion);
router.get("/topics/:topicId/questions/:questionId", questionController.showQuestion);
router.post("/topics/:topicId/questions/:questionId/delete", questionController.deleteQuestion);
router.post("/topics/:topicId/questions/:questionId/options", answerOptionController.addAnswerOption);
router.post("/topics/:topicId/questions/:questionId/options/:optionId/delete", answerOptionController.deleteAnswerOption);

router.get("/quiz", topicController.showQuizTopics);
router.get("/quiz/:topicId", topicController.chooseRandomQuestion);
router.get("/quiz/:topicId/questions/:questionId", questionController.showQuizQuestion);
router.post("/quiz/:topicId/questions/:questionId/options/:optionId", answerController.checkAnswer);
router.get("/quiz/:topicId/questions/:questionId/correct", answerController.correctAnswer);
router.get("/quiz/:topicId/questions/:questionId/incorrect", answerController.incorrectAnswer);

export { router };
