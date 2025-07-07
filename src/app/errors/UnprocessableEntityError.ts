// errors/UnprocessableEntityError.ts
export class UnprocessableEntityError extends Error {
	status = 422;
	errors: {
		[key: string]: string[];
	};

	constructor(
		message = "Unprocessable Entity",
		errors: {
			[key: string]: string[];
		} = {},
	) {
		super(message);
		this.name = "UnprocessableEntityError";
		this.errors = errors;
	}
}
