import { auth } from "@clerk/tanstack-react-start/server";
import { createMiddleware } from "@tanstack/react-start";
import { USER_ROLE } from "@/lib/constants";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
	const { userId } = await auth();
	return next({ context: { userId } });
});

export const assertAuthMiddleware = createMiddleware()
	.middleware([authMiddleware])
	.server(async ({ next, context }) => {
		if (!context.userId) throw new Error("You are not authenticated");
		return next({ context: { userId: context.userId } });
	});

export const assertAdminMiddleware = createMiddleware()
	.middleware([assertAuthMiddleware])
	.server(async ({ next }) => {
		const { sessionClaims, userId } = await auth();
		if (
			(sessionClaims as CustomJwtSessionClaims)?.metadata?.role !==
			USER_ROLE.ADMIN
		)
			throw new Error("Not Authorized for action");
		return next({ context: { userId } });
	});
