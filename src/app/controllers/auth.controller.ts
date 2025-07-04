import { LoggerUtils, ResponseUtils, ValidationUtils } from "@/utils";
import { Context } from "elysia";
import z from "zod";

const loginSchema = z.object({
	email: z.string().min(1, "Username is required"),
	password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const AuthController = {
	login: (ctx: Context) => {
		// validation schema
		const validation = loginSchema.safeParse(ctx.body);
		if (!validation.success) {
			const error = ValidationUtils.transformValidationErrors(validation.error);
			return ResponseUtils.response(
				ctx,
				false,
				error,
				"Validation failed",
				422,
			);
		}

		return ResponseUtils.success(
			ctx,
			{
				email: validation.data.email,
			},
			"Login successful",
			200,
		);
	},
};
