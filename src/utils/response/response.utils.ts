import { Context } from "elysia";

export class ResponseUtils {
	static success<T>(
		ctx: Context,
		data: T | null,
		message: string = "Success",
		statusCode: number,
	) {
		ctx.status(statusCode);

		return {
			status: statusCode,
			success: true,
			message,
			data,
		};
	}

	static error(message: string, statusCode: number = 400) {
		return {
			status: statusCode,
			success: false,
			message,
			statusCode,
		};
	}

	static notFound(message: string = "Resource not found") {
		return this.error(message, 404);
	}

	static unauthorized(message: string = "Unauthorized") {
		return this.error(message, 401);
	}
}
