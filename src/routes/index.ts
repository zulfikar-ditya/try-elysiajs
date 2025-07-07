import { AuthController } from "@/app/controllers/auth.controller";
import { authMiddleware } from "@/app/middlewares/auth.middleware";
import { DateUtils, ResponseUtils } from "@/utils";
import Elysia, { Context } from "elysia";

const routes = new Elysia();

routes.get("/", (ctx: Context) => {
	return ResponseUtils.success(ctx, null, "Welcome to ElysiaJS!", 200);
});

routes.get("/health", (ctx: Context) => {
	return ResponseUtils.success(
		ctx,
		{
			app_name: process.env.APP_NAME || "Elysia App",
			date: DateUtils.now().format("YYYY-MM-DD HH:mm:ss"),
			app_env: process.env.APP_ENV || "development",
		},
		"Ok",
		200,
	);
});

routes.post("/auth/login", AuthController.login);

// AUTH MIDDLEWARE GROUP
routes.group("", (app) => {
	app.derive(async (ctx) => {
		await authMiddleware(ctx);
		return ctx;
	});

	app.get("/profile", AuthController.profile);
	return app;
});

export default routes;
