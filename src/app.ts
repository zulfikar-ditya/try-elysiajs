import cors from "@elysiajs/cors";
import { Elysia } from "elysia";
import { appConfig, CORSConfig } from "./config";
import routes from "./routes";
import { LoggerUtils } from "./utils";

const app = new Elysia()
	.onError(({ code, error }) => {
		switch (code) {
			case "NOT_FOUND":
				return {
					status: 404,
					success: false,
					message: "Page not found",
					data: null,
				};
			case "INTERNAL_SERVER_ERROR":
				LoggerUtils.error("Internal Server Error", error);
				return {
					status: 500,
					success: false,
					message: "Internal Server Error",
					data: null,
				};
			case "UNKNOWN":
				LoggerUtils.error("Unknown Error", error);
				return {
					status: 500,
					success: false,
					message: "An unknown error occurred",
					data: null,
				};
			default:
				LoggerUtils.error(`Unhandled error code: ${code}`, error);
				return error;
		}
	})
	.onAfterResponse(({ set, path }) => {
		LoggerUtils.info(`Response sent successfully ${performance.now()}`, {
			status: set.status,
			path,
		});
	})
	.use(cors(CORSConfig))
	.listen(appConfig.app_port);

// routes
app.use(routes);

export default app.fetch;

LoggerUtils.info(`ElysiaJS server is running on port ${appConfig.app_port}`);
