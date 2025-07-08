import { appConfig } from "@/config";
import { DateUtils, ResponseUtils } from "@/utils";
import { Context } from "elysia";

export const AppController = {
	home: (ctx: Context) => {
		return ResponseUtils.success(
			ctx,
			{
				app_name: appConfig.app_name,
				app_env: appConfig.app_env,
				date: DateUtils.getDateInformative(DateUtils.now()),
			},
			`Welcome to ${appConfig.app_name}`,
			200,
		);
	},

	health: (ctx: Context) => {
		return ResponseUtils.success(ctx, null, "Ok", 200);
	},
};
