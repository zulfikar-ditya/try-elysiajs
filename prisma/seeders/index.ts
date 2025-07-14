import { userSeeder } from "./user.seed";
import { prisma } from "../../src/app/repositories";
import { LoggerUtils } from "@utils";

async function seed() {
	try {
		await userSeeder(prisma);
		LoggerUtils.info("User seeding completed successfully.");
	} catch (error) {
		LoggerUtils.error("Error during user seeding:", error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

seed()
	.then(() => LoggerUtils.info("Seeding finished."))
	.catch((error) => LoggerUtils.error("Seeding failed:", error));
