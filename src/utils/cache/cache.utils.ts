import { redisConfig } from "@config";
import { LoggerUtils } from "@utils/logger/logger.utils";
import Redis from "ioredis";

class CacheUtils {
	private static redis: Redis | null = null;

	private static getRedisClient(): Redis {
		if (!this.redis) {
			this.redis = new Redis({
				host: redisConfig.host,
				port: redisConfig.port,
				password: redisConfig.password,
				db: redisConfig.db,
			});
		}

		return this.redis;
	}

	static async get<T>(key: string): Promise<T | null> {
		try {
			const client = this.getRedisClient();
			const value = await client.get(key);
			return value ? JSON.parse(value) : null;
		} catch (error) {
			LoggerUtils.error(`Error getting cache for key ${key}:`, error);
			return null;
		}
	}

	static async set<T>(
		key: string,
		value: T,
		ttl: number = 3600,
	): Promise<void> {
		try {
			const client = this.getRedisClient();
			await client.set(key, JSON.stringify(value), "EX", ttl);
		} catch (error) {
			LoggerUtils.error(`Error setting cache for key ${key}:`, error);
		}
	}

	static async delete(key: string): Promise<void> {
		try {
			const client = this.getRedisClient();
			await client.del(key);
		} catch (error) {
			LoggerUtils.error(`Error deleting cache for key ${key}:`, error);
		}
	}

	static async flush(): Promise<void> {
		try {
			const client = this.getRedisClient();
			await client.flushdb();
		} catch (error) {
			LoggerUtils.error("Error flushing Redis cache:", error);
		}
	}

	static async exists(key: string): Promise<boolean> {
		try {
			const client = this.getRedisClient();
			const exists = await client.exists(key);
			return exists === 1;
		} catch (error) {
			LoggerUtils.error(`Error checking existence of key ${key}:`, error);
			return false;
		}
	}

	static async remember<T>(
		key: string,
		callback: () => Promise<T>,
		ttl: 3600,
	): Promise<T | null> {
		const cachedValue = await this.get<T>(key);
		if (cachedValue !== null) {
			return cachedValue;
		}

		const freshValue = await callback();
		await this.set(key, freshValue, ttl);
		return freshValue;
	}

	static generateKey(...args: string[]): string {
		return args.join(":");
	}

	static async getKeys(pattern: string): Promise<string[]> {
		try {
			const client = this.getRedisClient();
			const keys = await client.keys(pattern);
			return keys;
		} catch (error) {
			LoggerUtils.error(`Error getting keys with pattern ${pattern}:`, error);
			return [];
		}
	}

	static async disconnect(): Promise<void> {
		try {
			if (this.redis) {
				await this.redis.quit();
				this.redis = null;
			}
		} catch (error) {
			LoggerUtils.error("Error disconnecting from Redis:", error);
		}
	}
}

export { CacheUtils };
