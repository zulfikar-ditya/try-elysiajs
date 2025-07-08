import { ResponseUtils, ValidationUtils } from "@/utils";
import { Context } from "elysia";
import z from "zod";
import { UserRepository } from "../repositories";

const loginSchema = z.object({
	email: z.string().min(1, "Username is required"),
	password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const AuthController = {
	login: async (ctx: Context) => {
		// validation schema
		const validation = loginSchema.safeParse(ctx.body);
		if (!validation.success) {
			const error = ValidationUtils.transformValidationErrors(validation.error);
			return ResponseUtils.validationError(ctx, error.errors);
		}

		try {
			const userInformation = await UserRepository().attemptAuth(
				validation.data.email,
				validation.data.password,
			);

			const token = await ctx.jwt.sign({
				id: userInformation.id,
				email: userInformation.email,
			});

			return ResponseUtils.success(
				ctx,
				{
					user_information: {
						...userInformation,
						password: undefined,
					},
					token: token,
				},
				"Login successful",
				200,
			);
		} catch (error) {
			throw error;
		}
	},

	profile: async (ctx: Context) => {
		if (!ctx.user) {
			return ResponseUtils.unauthorized();
		}

		const userInformation = await UserRepository().userInformation(ctx.user.id);
		return ResponseUtils.success(
			ctx,
			{
				user_information: userInformation,
			},
			"User profile retrieved successfully",
			200,
		);
	},
};
