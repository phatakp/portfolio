import z4 from "zod/v4";

export const LoginSchema = z4.object({
	email: z4.email({ error: "Email is required" }),
});

export const ProfileSchema = z4.object({
	firstName: z4.string({ error: "First Name is required" }),
	lastName: z4.string({ error: "Last Name is required" }),
});

export const RegisterSchema = z4.object({
	...LoginSchema.shape,
	...ProfileSchema.shape,
});

export const VerifyEmailSchema = z4.object({
	code: z4
		.string({ error: "Verification code is required" })
		.min(6, { error: "Invalid Code" })
		.max(6, { error: "Invalid Code" }),
});
