import type z4 from "zod/v4";
import type {
	DeleteIdSchema,
	PaymentSchema,
	ScheduleSchema,
} from "@/lib/zod/osian.schema";
import type { UserIdSchema } from "@/lib/zod/user.schema";
import { OsianRepository } from "./osian.repository";

class OsianService {
	private repo = new OsianRepository();

	async createPayment(request: z4.infer<typeof PaymentSchema>) {
		return this.repo.createPayment(request);
	}

	async updatePayment(request: z4.infer<typeof PaymentSchema>) {
		return this.repo.updatePayment(request);
	}

	async deletePayment(request: z4.infer<typeof DeleteIdSchema>) {
		return this.repo.deletePayment(request);
	}

	async updateSchedule(request: z4.infer<typeof ScheduleSchema>) {
		return this.repo.updateSchedule(request);
	}

	async getPayments(request: z4.infer<typeof UserIdSchema>) {
		return this.repo.getPayments(request);
	}

	async getSchedule(request: z4.infer<typeof UserIdSchema>) {
		return this.repo.getSchedule(request);
	}
}

export const osianService = new OsianService();
