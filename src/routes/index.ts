import { AppController, AuthController } from "@app/controllers";
import { authMiddleware } from "@app/middlewares";
import Elysia from "elysia";

const routes = new Elysia();

routes.get("/", AppController.home);
routes.get("/health", AppController.health);

routes.post("/auth/login", AuthController.login);
routes.post("/auth/forgot-password", AuthController.forgotPassword);
routes.post("/auth/reset-password", AuthController.resetPassword);

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
