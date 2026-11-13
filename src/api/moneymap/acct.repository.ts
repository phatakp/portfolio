import type z4 from "zod/v4";
import { api, handleAPIError } from "@/integrations/axios";
import type {
	AcctReqSchema,
	DeleteIdSchema,
	InvReqSchema,
} from "@/lib/zod/acct.schema";
import type { UserIdSchema } from "@/lib/zod/user.schema";
import type { AcctResponse, APIResponse, InvResponse } from "@/types";

export class AcctRepository {
	url = `${process.env.MONEYMAP_GOOGLE_API_URL}`;

	async createAccount(request: z4.infer<typeof AcctReqSchema>) {
		try {
			const { rowNumber, ...input } = request;
			const res = await api.post(
				this.url,
				JSON.stringify({ data: input, action: "create", target: "account" }),
			);
			const data = res.data as APIResponse<AcctResponse>;
			if (data.success) return data;
			else throw new Error(data.message);
		} catch (error) {
			handleAPIError(error);
		}
	}

	async updateAccount(request: z4.infer<typeof AcctReqSchema>) {
		try {
			const { rowNumber, ...input } = request;
			if (!rowNumber) throw new Error("Row number is required");
			const res = await api.post(
				this.url,
				JSON.stringify({
					data: input,
					action: "update",
					target: "account",
					rowNumber,
				}),
			);
			const data = res.data as APIResponse<AcctResponse>;
			if (data.success) return data;
			else throw new Error(data.message);
		} catch (error) {
			handleAPIError(error);
		}
	}

	async deleteAccount(request: z4.infer<typeof DeleteIdSchema>) {
		try {
			const { rowNumber } = request;
			if (!rowNumber) throw new Error("Row number is required");
			const res = await api.post(
				this.url,
				JSON.stringify({
					action: "delete",
					target: "account",
					rowNumber,
				}),
			);
			const data = res.data as APIResponse<AcctResponse>;
			if (data.success) return data;
			else throw new Error(data.message);
		} catch (error) {
			handleAPIError(error);
		}
	}

	async createInvestment(request: z4.infer<typeof InvReqSchema>) {
		try {
			const { rowNumber, ...input } = request;
			const res = await api.post(
				this.url,
				JSON.stringify({
					data: input,
					action: "create",
					target: "investment",
				}),
			);
			const data = res.data as APIResponse<InvResponse>;
			if (data.success) return data;
			else throw new Error(data.message);
		} catch (error) {
			handleAPIError(error);
		}
	}

	async updateInvestment(request: z4.infer<typeof InvReqSchema>) {
		try {
			const { rowNumber, ...input } = request;
			if (!rowNumber) throw new Error("Row number is required");
			const res = await api.post(
				this.url,
				JSON.stringify({
					data: input,
					action: "update",
					target: "investment",
					rowNumber,
				}),
			);
			const data = res.data as APIResponse<InvResponse>;
			if (data.success) return data;
			else throw new Error(data.message);
		} catch (error) {
			handleAPIError(error);
		}
	}

	async deleteInvestment(request: z4.infer<typeof DeleteIdSchema>) {
		try {
			const { rowNumber } = request;
			if (!rowNumber) throw new Error("Row number is required");
			const res = await api.post(
				this.url,
				JSON.stringify({
					action: "delete",
					target: "investment",
					rowNumber,
				}),
			);
			const data = res.data as APIResponse<InvResponse>;
			if (data.success) return data;
			else throw new Error(data.message);
		} catch (error) {
			handleAPIError(error);
		}
	}

	async getUserAccounts(request: z4.infer<typeof UserIdSchema>) {
		try {
			const params = `?action=read&userId=${request.clerkId}&target=account`;
			const res = await api.get(`${this.url}${params}`);
			const data = res.data as APIResponse<AcctResponse>;
			if (data.success) return data;
			else throw new Error(data.message);
		} catch (error) {
			handleAPIError(error);
		}
	}

	async getUserInvestments(request: z4.infer<typeof UserIdSchema>) {
		try {
			const params = `?action=read&userId=${request.clerkId}&target=investment`;
			const res = await api.get(`${this.url}${params}`);
			const data = res.data as APIResponse<InvResponse>;
			if (data.success) return data;
			else throw new Error(data.message);
		} catch (error) {
			handleAPIError(error);
		}
	}
}
