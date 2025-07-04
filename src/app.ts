import cors from "@elysiajs/cors";
import { Elysia } from "elysia";
import { appConfig, CORSConfig } from "./config";
import routes from "./routes";
import { LoggerUtils } from "./utils";

const app = new Elysia().use(cors(CORSConfig)).listen(appConfig.app_port);

// routes
app.use(routes);

export default app.fetch;

LoggerUtils.info(`ElysiaJS server is running on port ${appConfig.app_port}`);
