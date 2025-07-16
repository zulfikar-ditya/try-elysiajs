import { LoggerUtils } from "@utils/index";
import { transporter } from "./transporter.mail";
import fs from "fs";
import path from "path";
import { appConfig, mailConfig } from "@config";

interface EmailOptions {
	to: string;
	subject: string;
	template?: string;
	variables?: Record<string, string>;
	html?: string;
	text?: string;
}

export const EmailService = {
	async sendEmail(options: EmailOptions) {
		let htmlContent = options.html;

		if (options.template) {
			const templatePath = path.join(
				__dirname,
				"templates",
				`${options.template}.html`,
			);
			htmlContent = fs.readFileSync(templatePath, "utf-8");

			// Replace variables in template
			if (options.variables) {
				Object.entries(options.variables).forEach(([key, value]) => {
					htmlContent = htmlContent?.replace(
						new RegExp(`{{${key}}}`, "g"),
						value,
					);
				});
			}
		}

		if (appConfig.app_env !== "production") {
			options.subject = `[${appConfig.app_env.toUpperCase()}] ${options.subject}`;
		}

		const mailOptions = {
			from: mailConfig.from || "noreply@yourapp.com",
			to: options.to,
			subject: options.subject,
			html: htmlContent,
			text: options.text,
		};

		LoggerUtils.info(
			`Sending email to ${options.to} with subject "${options.subject}"`,
		);

		return await transporter
			.sendMail({
				...mailOptions,
			})
			.then(() => {
				LoggerUtils.info(
					`Email sent to ${options.to} with subject "${options.subject}"`,
				);
			})
			.catch((error) => {
				LoggerUtils.error(`Failed to send email to ${options.to}:`, error);
				throw new Error("Failed to send email");
			});
	},
};
