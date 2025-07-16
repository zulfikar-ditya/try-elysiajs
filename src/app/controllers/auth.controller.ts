import { ResponseUtils, ValidationUtils } from "@utils";
import { Context } from "elysia";
import z from "zod";
import { UserRepository } from "@repositories";
import { PasswordResetTokenRepository } from "@app/repositories/password-reset-token.repository";
import { ForgotPasswordMail } from "@app/mails/forgot-password.mail";

const loginSchema = z.object({
	email: z.string().min(1, "Username is required"),
	password: z.string().min(6, "Password must be at least 6 characters long"),
});

const forgotPasswordSchema = z.object({
	email: z.string().email("Invalid email address"),
});

const resetPasswordSchema = z.object({
	token: z.string().min(1, "Token is required"),
	password: z.string().min(6, "Password must be at least 6 characters long"),
	password_confirmation: z.string().min(6, "Password confirmation is required"),
});

export const AuthController = {
	login: async (ctx: Context) => {
		// validation schema
		const validation = loginSchema.safeParse(ctx.body);
		if (!validation.success) {
			const error: {
				message: string;
				errors: {
					[key: string]: string[];
				};
			} = ValidationUtils.transformValidationErrors(validation.error);
			return ResponseUtils.validationError(
				ctx,
				error.errors,
				error.message,
				422,
			);
		}

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

	forgotPassword: async (ctx: Context) => {
		// validation schema
		const validation = forgotPasswordSchema.safeParse(ctx.body);
		if (!validation.success) {
			const error: {
				message: string;
				errors: {
					[key: string]: string[];
				};
			} = ValidationUtils.transformValidationErrors(validation.error);
			return ResponseUtils.validationError(
				ctx,
				error.errors,
				error.message,
				422,
			);
		}

		const user = await UserRepository().user.findUnique({
			where: { email: validation.data.email, deletedAt: null },
			select: {
				id: true,
				email: true,
				name: true,
			},
		});
		if (!user) {
			return ResponseUtils.success(
				ctx,
				null,
				"Password reset token created successfully",
				200,
			);
		}

		const token = await PasswordResetTokenRepository().createPasswordResetToken(
			user.id,
		);

		await ForgotPasswordMail.send(user.email, user.name, token.token);

		return ResponseUtils.success(
			ctx,
			null,
			"Password reset token created successfully",
			200,
		);
	},

	resetPassword: async (ctx: Context) => {
		// validation schema
		const validation = resetPasswordSchema.safeParse(ctx.body);
		if (!validation.success) {
			const error: {
				message: string;
				errors: {
					[key: string]: string[];
				};
			} = ValidationUtils.transformValidationErrors(validation.error);
			return ResponseUtils.validationError(
				ctx,
				error.errors,
				error.message,
				422,
			);
		}

		const token = await PasswordResetTokenRepository().findByToken(
			validation.data.token,
		);
		if (!token) {
			return ResponseUtils.validationError(
				ctx,
				{ token: ["Invalid or expired token"] },
				"Invalid token or token has expired",
				422,
			);
		}

		if (validation.data.password !== validation.data.password_confirmation) {
			return ResponseUtils.validationError(
				ctx,
				{ password_confirmation: ["Passwords do not match"] },
				"Validation error",
				422,
			);
		}

		await UserRepository().updatePassword(
			token.user_id,
			validation.data.password,
		);

		await PasswordResetTokenRepository().deleteById(token.id);

		return ResponseUtils.success(ctx, null, "Password reset successfully", 200);
	},
};
