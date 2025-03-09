import { Application, Session } from "./deps.js";
import { authorizationMiddleware } from "./middlewares/authorizationMiddleware.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { renderMiddleware } from "./middlewares/renderMiddleware.js";
import { serveStaticMiddleware } from "./middlewares/serveStaticMiddleware.js";
import { router } from "./routes/routes.js";
import { router as apiRouter } from "./routes/apis/api.js";

const app = new Application();

app.use(errorMiddleware);
app.use(serveStaticMiddleware);
app.use(renderMiddleware);
app.use(Session.initMiddleware());
app.use(authorizationMiddleware);
app.use(router.routes());
app.use(apiRouter.routes());

export { app };
