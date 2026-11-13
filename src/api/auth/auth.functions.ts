import { auth } from "@clerk/tanstack-react-start/server";
import { createServerFn } from "@tanstack/react-start";
import { USER_ROLE } from "@/lib/constants";

export const getAuthToken = createServerFn().handler(async () => {
	// 2. Extract Clerk authentication details from the request
	const { userId, getToken } = await auth();

	if (!userId) {
		return null;
	}

	// 3. Fetch the actual raw JWT authentication token
	const token = await getToken();
	return { token, userId };
});

export const getLoggedInUser = createServerFn({ method: "GET" }).handler(
	async () => {
		// let user: User | undefined;
		try {
			const { userId, sessionClaims } = await auth();
			if (!userId) throw Error("Not authenticated");

			return {
				userId,
				role: (sessionClaims.metadata?.role ?? USER_ROLE.USER) as UserRole,
				firstName: sessionClaims?.firstName as string,
				lastName: sessionClaims?.lastName as string,
				imageUrl: sessionClaims?.imageUrl as string | undefined,
			};
		} catch (_) {
			return {
				userId: undefined,
				role: undefined,
				firstName: undefined,
				lastName: undefined,
				imageUrl: undefined,
			};
		}
	},
);
