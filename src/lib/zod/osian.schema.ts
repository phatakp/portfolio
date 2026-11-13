import z4 from "zod/v4";
import { PaymentSourceSchema, PaymentTypeSchema } from "./common.schema";

export const PaymentSchema = z4.object({
	rowNumber: z4.coerce.number<number>(),
	userId: z4.string({ error: "User ID is required" }),
	description: z4.string({ error: "Description is required" }),
	source: PaymentSourceSchema,
	type: PaymentTypeSchema,
	amount: z4.coerce
		.number<number>({ error: "Amount is required" })
		.min(0, { error: "Amount should be positive" }),
	date: z4.string(),
});

export const ScheduleSchema = z4.object({
	rowNumber: z4.coerce.number<number>(),
	userId: z4.string({ error: "User ID is required" }),
	description: z4.string({ error: "Description is required" }),
	principalDue: z4.coerce
		.number<number>({ error: "Principal Due is required" })
		.min(0, { error: "Principal Due should be positive" }),
	gstDue: z4.coerce
		.number<number>({ error: "GST Due is required" })
		.min(0, { error: "GST Due should be positive" }),
	totalDue: z4.coerce
		.number<number>({ error: "Total Due is required" })
		.min(0, { error: "Total Due should be positive" }),
	principalPaid: z4.coerce
		.number<number>({ error: "Principal Paid is required" })
		.min(0, { error: "Principal Paid should be positive" }),
	gstPaid: z4.coerce
		.number<number>({ error: "GST Paid is required" })
		.min(0, { error: "GST Paid should be positive" }),
	totalPaid: z4.coerce
		.number<number>({ error: "Total Paid is required" })
		.min(0, { error: "Total Paid should be positive" }),
	duePercent: z4.coerce
		.number<number>({ error: "Due% is required" })
		.min(0, { error: "Due% should be positive" }),
	remaining: z4.coerce
		.number<number>({ error: "Due% is required" })
		.min(0, { error: "Due% should be positive" }),
	completed: z4.string(),
});

export const PaymentResponseSchema = z4.object({
	rowNumber: z4.coerce.number<number>(),
	record: PaymentSchema,
});

export const ScheduleResponseSchema = z4.object({
	rowNumber: z4.coerce.number<number>(),
	record: ScheduleSchema,
});

export const DeleteIdSchema = z4.object({
	rowNumber: z4.coerce.number<number>(),
	userId: z4.string(),
});
