import { createMiddleware } from "@tanstack/react-start";

export const withMetaLogger = (url: string, functionName: string) =>
	createMiddleware({
		type: "function",
	})
		.client(async ({ next, method }) => {
			return await next({ sendContext: { method, url, functionName } });
		})
		.server(async ({ next, data, context }) => {
			if (process.env.NODE_ENV?.includes("prod")) return await next();

			try {
				const startTime = Date.now();

				console.log(
					"--------------------\n",
					`[SERVER] Calling ${context.functionName} ${data ? `with Arguments: ${JSON.stringify(data)}` : ""}`,
				);

				const result = await next();

				const duration = Date.now() - startTime;

				console.log(
					`[SERVER] Finished ${context.url} in ${duration}ms`,
					"--------------------\n",
				);

				return result;
			} catch (error) {
				console.warn(
					`[SERVER] Error ${context.functionName} ${JSON.stringify(error, null, 4)}`,
				);
				throw error;
			}
		});
