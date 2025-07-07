import Elysia from "elysia";
import { UserInformation } from "./user";

export interface Context extends Elysia.Context {
	user: UserInformation | null;
}
