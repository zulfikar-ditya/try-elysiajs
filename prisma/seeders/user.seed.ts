import { Prisma } from "@prisma/client";
import { HashUtils } from "@utils";

export const userSeeder = async (prisma: Prisma.TransactionClient) => {
	const users = ["admin", "user1", "user2"];
	const hashPassword = await HashUtils.generateHash("password");

	for (const username of users) {
		await prisma.user.upsert({
			where: {
				email: `${username}@example.com`,
			},
			update: {},
			create: {
				name: username.charAt(0).toUpperCase() + username.slice(1),
				email: `${username}@example.com`,
				password: hashPassword,
			},
		});
	}
};
