import { UserInformation } from "./user";

declare module "elysia" {
	namespace Elysia {
		interface Context {
			user: UserInformation | null;
			// Add more custom properties here if needed
			// permissions?: string[];
			// role?: string;
		}
	}
}
