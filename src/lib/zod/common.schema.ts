import z4 from "zod/v4";
import {
	ACCOUNT_TYPE_OPTIONS,
	APP_OPTIONS,
	BANK_OPTIONS,
	CLASSIFICATION_OPTIONS,
	INVESTMENT_SUBTYPE_OPTIONS,
	INVESTMENT_TYPE_OPTIONS,
	PAYMENT_SOURCE_OPTIONS,
	PAYMENT_TYPE_OPTIONS,
	TXN_TYPE_OPTIONS,
	USER_ROLE_OPTIONS,
} from "@/lib/constants";

export const AppSchema = z4.enum(APP_OPTIONS);
export const UserRoleSchema = z4.enum(USER_ROLE_OPTIONS);
export const BankSchema = z4.enum(BANK_OPTIONS);
export const AcctTypeSchema = z4.enum(ACCOUNT_TYPE_OPTIONS);
export const ClassificationSchema = z4.enum(CLASSIFICATION_OPTIONS);
export const InvTypeSchema = z4.enum(INVESTMENT_TYPE_OPTIONS);
export const InvSubTypeSchema = z4.enum(INVESTMENT_SUBTYPE_OPTIONS);
export const TxnTypeSchema = z4.enum(TXN_TYPE_OPTIONS);
export const OptionalAcctTypeSchema = z4.enum(ACCOUNT_TYPE_OPTIONS).optional();
export const PaymentSourceSchema = z4.enum(PAYMENT_SOURCE_OPTIONS);
export const PaymentTypeSchema = z4.enum(PAYMENT_TYPE_OPTIONS);

export const APIResponseSchema = z4.object({
	success: z4.coerce.boolean<boolean>(),
	count: z4.coerce.number<number>(),
	status: z4.coerce.number<number>(),
});
