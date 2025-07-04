interface CorsConfig {
	origin: string | string[];
	methods: string[];
	allowedHeaders: string[];
	credentials: boolean;
	maxAge: number;
	// exposeHeaders?: string[];
}

export const CORSConfig: CorsConfig = {
	origin: "*",
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
	credentials: false,
	maxAge: 86400,
	// exposeHeaders: [],
};
