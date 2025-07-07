import { userSeeder } from "./user.seed";
import { prisma } from "../../src/app/repositories/index";

async function seed() {
	try {
		userSeeder(prisma);
		console.log("Seeding completed successfully.");
	} catch (error) {
		console.error("Error during seeding:", error);
	} finally {
		await prisma.$disconnect();
	}
}

seed()
	.then(() => console.log("Seeding finished."))
	.catch((error) => console.error("Seeding failed:", error));
