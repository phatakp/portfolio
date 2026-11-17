import z4, { ZodCUID2, z } from "zod/v4";
import {
	AcctTypeSchema,
	BankSchema,
	ClassificationSchema,
	InvSubTypeSchema,
	InvTypeSchema,
} from "./common.schema";

export const AcctSchema = z4.object({
	userId: z4.string({ error: "User ID is required" }),
	email: z4.string({ error: "User Email is required" }),
	userName: z4.string({ error: "User Name is required" }),
	bank: BankSchema,
	acctType: AcctTypeSchema,
	acctNumber: z4.string({ error: "Acct Number is required" }),
	acctName: z4.string({ error: "Acct Name is required" }),
	balance: z4.coerce
		.number<number>({ error: "Acct Balance is required" })
		.min(0, { error: "Balance should be positive" }),
	currValue: z4.coerce.number<number>(),
	gainsOrLoss: z4.coerce.number<number>(),
	returns: z4.coerce.number<number>(),
	remarks: z4
		.union([z4.string(), z4.undefined()])
		.transform((e) => (e === "" ? undefined : e)),
	classification: ClassificationSchema,
	asOfDate: z4.coerce.date<Date>(),
});

export const InvestmentSchema = z4.object({
	userId: z4.string({ error: "User ID is required" }),
	email: z4.string({ error: "User Email is required" }),
	userName: z4.string({ error: "User Name is required" }),
	fundName: z4.string({ error: "Fund Name is required" }),
	broker: BankSchema,
	invType: InvTypeSchema,
	subType: InvSubTypeSchema,
	category: z4.string({ error: "Category is required" }),
	googleCode: z4.string({ error: "Google Code is required" }),
	investedAmt: z4.coerce
		.number<number>({ error: "Acct Balance is required" })
		.min(0, { error: "Balance should be positive" }),
	quantity: z4.coerce
		.number<number>({ error: "Acct Balance is required" })
		.min(0, { error: "Balance should be positive" }),
	avgPrice: z4.coerce.number<number>(),
	currPrice: z4.coerce.number<number>(),
	currValue: z4.coerce.number<number>(),
	gainsOrLoss: z4.coerce.number<number>(),
	returns: z4.coerce.number<number>(),
	sip: z4.coerce.number<number>(),
	remarks: z4
		.union([z4.string(), z4.undefined()])
		.transform((e) => (e === "" ? undefined : e)),
});

export const AcctReqSchema = AcctSchema.omit({
	acctName: true,
	gainsOrLoss: true,
	returns: true,
}).extend({
	rowNumber: z4.coerce.number<number>(),
});

export const InvReqSchema = InvestmentSchema.omit({
	currPrice: true,
	gainsOrLoss: true,
	returns: true,
}).extend({
	rowNumber: z4.coerce.number<number>(),
});

export const OptionSchema = z4.object({
	type: z4.string(),
	value: z4.string(),
});

export const AcctResponseSchema = z4.object({
	rowNumber: z4.coerce.number<number>(),
	record: AcctSchema,
});

export const InvResponseSchema = z4.object({
	rowNumber: z4.coerce.number<number>(),
	record: InvestmentSchema,
});

export const OptionResponseSchema = z4.object({
	rowNumber: z4.coerce.number<number>(),
	record: OptionSchema,
});

export const DeleteIdSchema = z4.object({
	rowNumber: z4.coerce.number<number>(),
	userId: z4.string(),
});

export const UserIdSchema = z4.object({
	userId: z4.string(),
});
