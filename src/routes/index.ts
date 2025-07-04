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

export default routes;
