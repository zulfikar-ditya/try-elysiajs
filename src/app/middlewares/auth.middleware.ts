import { UnauthorizedError } from "@errors";
import { UserRepository } from "@repositories";
import { AppContext } from "@appTypes/elysia";

export const authMiddleware = async (ctx: AppContext) => {
	try {
		const token = getTokenFromHeader(ctx);
		const payload: {
			id: string;
			email: string;
		} | null = await ctx.jwt.verify(token);

		if (!payload) {
			throw new UnauthorizedError();
		}

		const userInformation = await UserRepository().userInformation(payload.id);
		if (!userInformation) {
			throw new UnauthorizedError("User not found");
		}

		ctx.user = userInformation;
	} catch {
		throw new UnauthorizedError();
	}
};

function getTokenFromHeader(ctx: AppContext): string | null {
	const authHeader = ctx.request.headers.get("Authorization");
	if (authHeader && authHeader.startsWith("Bearer ")) {
		return authHeader.split(" ")[1];
	}

	return null;
}
