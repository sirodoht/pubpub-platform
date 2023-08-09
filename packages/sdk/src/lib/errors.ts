const StatusText = {
	100: "Continue",
	101: "Switching Protocols",
	200: "OK",
	201: "Created",
	202: "Accepted",
	400: "Bad Request",
	401: "Unauthorized",
	403: "Forbidden",
	404: "Not Found",
	405: "Method Not Allowed",
	408: "Request Timeout",
	409: "Conflict",
	500: "Internal Server Error",
	501: "Not Implemented",
	502: "Bad Gateway",
	503: "Service Unavailable",
	504: "Gateway Time-out",
}

export class IntegrationError extends Error {
	toJSON() {
		if (this.cause) {
			return { message: this.message, cause: this.cause.toString() }
		}
		return { message: this.message }
	}
}

export class ResponseError extends IntegrationError {
	declare cause: Response

	constructor(
		cause: Response | keyof typeof StatusText,
		message: string = "Unexpected error"
	) {
		if (typeof cause === "number") {
			cause = new Response(null, {
				status: cause,
				statusText: StatusText[cause],
			})
		}
		super(`${message}`, { cause })
	}

	toJSON() {
		return {
			message: this.message,
			cause: `The server responded with ${this.cause.status} (${this.cause.statusText})`,
		}
	}
}

export class PubPubError extends IntegrationError {}