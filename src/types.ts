import type z4 from "zod/v4";
import type {
	AcctResponseSchema,
	AcctSchema,
	InvestmentSchema,
	InvResponseSchema,
} from "./lib/zod/acct.schema";
import type {
	AcctTypeSchema,
	APIResponseSchema,
	AppSchema,
	BankSchema,
	ClassificationSchema,
	InvTypeSchema,
	PaymentSourceSchema,
	PaymentTypeSchema,
	UserRoleSchema,
} from "./lib/zod/common.schema";
import type {
	PaymentResponseSchema,
	PaymentSchema,
	ScheduleResponseSchema,
	ScheduleSchema,
} from "./lib/zod/osian.schema";
import type { UserSchema } from "./lib/zod/user.schema";

export type SelectOption = {
	label: string;
	value: string;
};

export type App = z4.infer<typeof AppSchema>;
export type UserRole = z4.infer<typeof UserRoleSchema>;
export type AccountType = z4.infer<typeof AcctTypeSchema>;
export type InvType = z4.infer<typeof InvTypeSchema>;
export type Classification = z4.infer<typeof ClassificationSchema>;

export type User = z4.infer<typeof UserSchema>;

export type Bank = z4.infer<typeof BankSchema>;
export type Account = z4.infer<typeof AcctSchema>;
export type Investment = z4.infer<typeof InvestmentSchema>;

export type APIResponse<T> = z4.infer<typeof APIResponseSchema> & {
	message?: string;
	records: T[];
};

export type AcctResponse = z4.infer<typeof AcctResponseSchema>;
export type InvResponse = z4.infer<typeof InvResponseSchema>;

export type PaymentSource = z4.infer<typeof PaymentSourceSchema>;
export type PaymentType = z4.infer<typeof PaymentTypeSchema>;

export type PaymentResponse = z4.infer<typeof PaymentResponseSchema>;
export type ScheduleResponse = z4.infer<typeof ScheduleResponseSchema>;

export type Payment = z4.infer<typeof PaymentSchema>;
export type Schedule = z4.infer<typeof ScheduleSchema>;
