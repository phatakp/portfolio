import z4 from "zod/v4";
import { RegisterSchema } from "./auth.schema";
import { UserRoleSchema } from "./common.schema";

export const UserSchema = RegisterSchema.extend({
	clerkId: z4.string({ error: "Clerk ID is required" }),
	imageUrl: z4
		.union([z4.string(), z4.undefined()])
		.transform((e) => (e === "" ? undefined : e)),
	role: UserRoleSchema,
});

export const UserIdSchema = UserSchema.pick({ clerkId: true });
export const UserShortSchema = UserSchema.pick({
	clerkId: true,
	firstName: true,
	lastName: true,
});
