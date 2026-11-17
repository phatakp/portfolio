import type z4 from "zod/v4";
import { api, handleAPIError } from "@/integrations/axios";
import type {
	AcctReqSchema,
	DeleteIdSchema,
	InvReqSchema,
} from "@/lib/zod/acct.schema";
import type { UserIdSchema } from "@/lib/zod/user.schema";
import type {
	AcctResponse,
	APIResponse,
	InvResponse,
	OptionResponse,
} from "@/types";

export class AcctRepository {
	url = `${process.env.MONEYMAP_GOOGLE_API_URL}`;
	account = "Account";
	investment = "Investment";
	options = "Options";

	async createAccount(request: z4.infer<typeof AcctReqSchema>) {
		try {
			const { rowNumber, ...input } = request;
			const res = await api.post(
				this.url,
				JSON.stringify({
					data: input,
					action: "create",
					target: this.account,
				}),
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
					target: this.account,
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
					target: this.account,
					rowNumber,
					data: request.userId,
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
					target: this.investment,
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
					target: this.investment,
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
					target: this.investment,
					rowNumber,
					data: request.userId,
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
			const params = `?action=read&userId=${request.clerkId}&target=${this.account}`;
			const res = await api.get(`${this.url}${params}`);
			const data = res.data as APIResponse<AcctResponse>;
			if (data.success) return data;
			else if (data.status === 404)
				return { success: true, count: 0, records: [], status: 200 };
			else throw new Error(data.message);
		} catch (error) {
			handleAPIError(error);
		}
	}

	async getUserInvestments(request: z4.infer<typeof UserIdSchema>) {
		try {
			const params = `?action=read&userId=${request.clerkId}&target=${this.investment}`;
			const res = await api.get(`${this.url}${params}`);
			const data = res.data as APIResponse<InvResponse>;
			if (data.success) return data;
			else if (data.status === 404)
				return { success: true, count: 0, records: [], status: 200 };
			else throw new Error(data.message);
		} catch (error) {
			handleAPIError(error);
		}
	}

	async getOptions(request: z4.infer<typeof UserIdSchema>) {
		try {
			const params = `?action=read&userId=${request.clerkId}&target=${this.options}`;
			const res = await api.get(`${this.url}${params}`);
			const data = res.data as APIResponse<OptionResponse>;
			if (data.success) return data;
			else if (data.status === 404)
				return { success: true, count: 0, records: [], status: 200 };
			else throw new Error(data.message);
		} catch (error) {
			handleAPIError(error);
		}
	}
}
