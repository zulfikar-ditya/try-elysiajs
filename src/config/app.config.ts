interface AppConfig {
	app_name: string;
	app_port: number;
	app_env: "development" | "production" | "test";
	app_url: string;
	app_timezone: string;
	app_key: string;
	app_jwt_secret: string;
}

export const appConfig: AppConfig = {
	app_name: process.env.APP_NAME || "Elysia App",
	app_port: parseInt(process.env.APP_PORT || "3000", 10),
	app_env: (process.env.APP_ENV || "development") as
		| "development"
		| "production"
		| "test",
	app_url: process.env.APP_URL || "http://localhost:3000",
	app_timezone: process.env.APP_TIMEZONE || "UTC",
	app_key: process.env.APP_KEY || "default_key",
	app_jwt_secret: process.env.APP_JWT_SECRET || "default_jwt_secret",
};
