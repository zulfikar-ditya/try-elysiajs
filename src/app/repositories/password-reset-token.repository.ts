import { Prisma } from "@prisma/client";
import { prisma } from ".";
import { StrUtils, verificationTokenLifetime } from "@utils";

export const PasswordResetTokenRepository = (
	tx: Prisma.TransactionClient | null = null,
) => {
	const db = tx || prisma;
	return {
		passwordResetToken: db.passwordResetToken,

		createPasswordResetToken: async (
			userId: string,
		): Promise<{
			id: string;
			user_id: string;
			token: string;
			expiredAt: Date;
			createdAt: Date;
			updatedAt: Date;
		}> => {
			return db.passwordResetToken.create({
				data: {
					user_id: userId,
					token: StrUtils.random(255),
					expiredAt: verificationTokenLifetime,
				},
				select: {
					id: true,
					user_id: true,
					token: true,
					expiredAt: true,
					createdAt: true,
					updatedAt: true,
				},
			});
		},

		findByToken: async (
			token: string,
		): Promise<{
			id: string;
			user_id: string;
			token: string;
			expiredAt: Date;
			createdAt: Date;
			updatedAt: Date;
		} | null> => {
			return db.passwordResetToken.findUnique({
				where: { token },
				select: {
					id: true,
					user_id: true,
					token: true,
					expiredAt: true,
					createdAt: true,
					updatedAt: true,
				},
			});
		},

		deleteById: async (id: string): Promise<void> => {
			await db.passwordResetToken.delete({
				where: { id },
			});
		},
	};
};
