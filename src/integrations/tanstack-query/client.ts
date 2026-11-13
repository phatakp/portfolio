// src/integrations/tanstack-query/client.ts
import { QueryClient } from "@tanstack/react-query";

let clientInstance: QueryClient | undefined;

export function getQueryClient() {
	// Always create a new client on the server to prevent cross-request leakage
	if (typeof window === "undefined") {
		return createNewClient();
	}

	// Reuse the same client on the browser client
	if (!clientInstance) {
		clientInstance = createNewClient();
	}
	return clientInstance;
}

function createNewClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: Infinity,
				refetchOnMount: false,
				refetchOnWindowFocus: false,
				refetchOnReconnect: false,
			},
		},
	});
}
