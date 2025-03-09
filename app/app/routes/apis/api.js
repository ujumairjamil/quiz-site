import { oakCors, Router } from "../../deps.js";
import * as apiController from "../controllers/apiController.js";

const router = new Router();

router.get("/api/questions/random", apiController.getRandomQuestion);
router.post("/api/questions/answer", oakCors(), apiController.checkAnswer);

export { router };