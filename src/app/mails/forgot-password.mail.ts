import { EmailService } from "./email.service";

export class ForgotPasswordMail {
	static async send(email: string, name: string, resetToken: string) {
		const resetUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}`;

		return await EmailService.sendEmail({
			to: email,
			subject: "Password Reset Request",
			template: "password-reset",
			variables: {
				name: name,
				resetUrl: resetUrl,
				resetToken: resetToken,
			},
		});
	}
}
