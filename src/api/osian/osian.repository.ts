import type z4 from "zod/v4";
import { api, handleAPIError } from "@/integrations/axios";
import type {
	DeleteIdSchema,
	PaymentSchema,
	ScheduleSchema,
} from "@/lib/zod/osian.schema";
import type { UserIdSchema } from "@/lib/zod/user.schema";
import type { APIResponse, PaymentResponse, ScheduleResponse } from "@/types";

export class OsianRepository {
	url = `${process.env.OSIAN_GOOGLE_API_URL}`;

	async createPayment(request: z4.infer<typeof PaymentSchema>) {
		try {
			const { rowNumber, ...input } = request;
			const res = await api.post(
				this.url,
				JSON.stringify({ data: input, action: "create", target: "payment" }),
			);
			const data = res.data as APIResponse<PaymentResponse>;
			if (data.success) return data;
			else throw new Error(data.message);
		} catch (error) {
			handleAPIError(error);
		}
	}

	async updatePayment(request: z4.infer<typeof PaymentSchema>) {
		try {
			const { rowNumber, ...input } = request;
			if (!rowNumber) throw new Error("Row number is required");
			const res = await api.post(
				this.url,
				JSON.stringify({
					data: input,
					action: "update",
					target: "payment",
					rowNumber,
				}),
			);
			const data = res.data as APIResponse<PaymentResponse>;
			if (data.success) return data;
			else throw new Error(data.message);
		} catch (error) {
			handleAPIError(error);
		}
	}

	async deletePayment(request: z4.infer<typeof DeleteIdSchema>) {
		try {
			const { rowNumber, userId } = request;
			if (!rowNumber) throw new Error("Row number is required");
			const res = await api.post(
				this.url,
				JSON.stringify({
					action: "delete",
					target: "payment",
					rowNumber,
					data: { userId },
				}),
			);
			const data = res.data as APIResponse<PaymentResponse>;
			if (data.success) return data;
			else throw new Error(data.message);
		} catch (error) {
			handleAPIError(error);
		}
	}

	async updateSchedule(request: z4.infer<typeof ScheduleSchema>) {
		try {
			const { rowNumber, ...input } = request;
			if (!rowNumber) throw new Error("Row number is required");
			const res = await api.post(
				this.url,
				JSON.stringify({
					data: input,
					action: "update",
					target: "schedule",
					rowNumber,
				}),
			);
			const data = res.data as APIResponse<ScheduleResponse>;
			if (data.success) return data;
			else throw new Error(data.message);
		} catch (error) {
			handleAPIError(error);
		}
	}

	async getPayments(request: z4.infer<typeof UserIdSchema>) {
		try {
			const params = `?action=read&userId=${request.clerkId}&target=payment`;
			const res = await api.get(`${this.url}${params}`);
			const data = res.data as APIResponse<PaymentResponse>;
			if (data.success) return data;
			else throw new Error(data.message);
		} catch (error) {
			handleAPIError(error);
		}
	}

	async getSchedule(request: z4.infer<typeof UserIdSchema>) {
		try {
			const params = `?action=read&userId=${request.clerkId}&target=schedule`;
			const res = await api.get(`${this.url}${params}`);
			const data = res.data as APIResponse<ScheduleResponse>;
			if (data.success) return data;
			else throw new Error(data.message);
		} catch (error) {
			handleAPIError(error);
		}
	}
}
