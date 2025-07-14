import cors from "@elysiajs/cors";
import { Elysia } from "elysia";
import { appConfig, CORSConfig } from "@config";
import jwt from "@elysiajs/jwt";
import { UnauthorizedError, UnprocessableEntityError } from "@errors";
import { LoggerUtils } from "@utils";
import routes from "@routes";

const app = new Elysia()
	.onError(({ code, error, set }) => {
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
				if (error instanceof UnprocessableEntityError) {
					return {
						status: 422,
						success: false,
						message: error.message,
						errors: error.errors,
					};
				}

				LoggerUtils.error("Unknown Error", error);
				return {
					status: 500,
					success: false,
					message: "An unknown error occurred",
					data: null,
				};
			default:
				if (error instanceof UnauthorizedError) {
					set.status = 401;
					return {
						status: 401,
						success: false,
						message: error.message,
						data: null,
					};
				}

				LoggerUtils.error(`Unhandled error code: ${code}`, error);
				return error;
		}
	})
	.onAfterResponse(({ set, path, request }) => {
		LoggerUtils.info(`${request.method}: ${path} - ${set.status}`);
	})
	.use(
		jwt({
			algorithm: "HS256",
			secret: appConfig.app_jwt_secret,
		}),
	)
	.use(cors(CORSConfig))
	.listen(appConfig.app_port);

// routes
app.use(routes);

export default app.fetch;

LoggerUtils.info(`ElysiaJS server is running on port ${appConfig.app_port}`);
