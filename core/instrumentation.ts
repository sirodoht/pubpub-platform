import { logger } from "logger";

export async function register() {
	if (process.env.NEXT_RUNTIME === "edge") {
		return;
	}

	logger.info(`Registering instrumentation hook for ${process.env.NEXT_RUNTIME}`);
	if (process.env.NEXT_RUNTIME === "nodejs") {
		await import("./instrumentation.registerCorePubFields.mts");
		if (process.env.NODE_ENV === "development") {
			logger.info(
				"NEXT_RUNTIME is `nodejs` and NODE_ENV is `development`; skipping OTEL registration."
			);
			return;
		}
		await import("./instrumentation.node.mts");
	} else {
		logger.info("NEXT_RUNTIME is not `nodejs`; skipping OTEL registration.");
	}
}
// Uses environment variables named HONEYCOMB_API_KEY and OTEL_SERVICE_NAME
