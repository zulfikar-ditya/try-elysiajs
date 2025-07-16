import { Prisma } from "@prisma/client";
import { prisma } from "@repositories";
import { HashUtils } from "@utils";
import { UnprocessableEntityError } from "@errors";
import { UnauthorizedError } from "@errors";

export const UserRepository = (tx: Prisma.TransactionClient | null = null) => {
	const db = tx || prisma;
	return {
		user: db.user,
		attemptAuth: async (
			email: string,
			password: string,
		): Promise<{
			id: string;
			email: string;
			name: string;
			password: string;
			createdAt: Date;
			updatedAt: Date;
		}> => {
			const user = await db.user.findUnique({
				where: { email, deletedAt: null },
				select: {
					id: true,
					email: true,
					name: true,
					password: true,
					createdAt: true,
					updatedAt: true,
				},
			});

			if (!user) {
				throw new UnprocessableEntityError("Invalid email or password", {
					email: ["Invalid email or password"],
				});
			}

			const isPasswordValid = await HashUtils.compareHash(
				password,
				user.password,
			);
			if (!isPasswordValid) {
				throw new UnprocessableEntityError("Invalid email or password", {
					email: ["Invalid email or password"],
				});
			}

			return user;
		},

		userInformation: async (
			id: string,
		): Promise<{
			id: string;
			email: string;
			name: string;
			createdAt: Date;
			updatedAt: Date;
		}> => {
			const user = await db.user.findUnique({
				where: { id, deletedAt: null },
				select: {
					id: true,
					email: true,
					name: true,
					createdAt: true,
					updatedAt: true,
				},
			});

			if (!user) {
				throw new UnauthorizedError("User not found");
			}

			return user;
		},

		updatePassword: async (
			userId: string,
			newPassword: string,
		): Promise<void> => {
			const hashedPassword = await HashUtils.generateHash(newPassword);
			await db.user.update({
				where: { id: userId },
				data: { password: hashedPassword },
			});
		},
	};
};
