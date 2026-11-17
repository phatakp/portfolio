import type z4 from "zod/v4";
import type {
	AcctReqSchema,
	DeleteIdSchema,
	InvReqSchema,
} from "@/lib/zod/acct.schema";
import type { UserIdSchema } from "@/lib/zod/user.schema";
import { AcctRepository } from "./acct.repository";

class AcctService {
	private repo = new AcctRepository();

	async createAccount(request: z4.infer<typeof AcctReqSchema>) {
		return this.repo.createAccount(request);
	}

	async updateAccount(request: z4.infer<typeof AcctReqSchema>) {
		return this.repo.updateAccount(request);
	}

	async deleteAccount(request: z4.infer<typeof DeleteIdSchema>) {
		return this.repo.deleteAccount(request);
	}

	async createInvestment(request: z4.infer<typeof InvReqSchema>) {
		return this.repo.createInvestment(request);
	}

	async updateInvestment(request: z4.infer<typeof InvReqSchema>) {
		return this.repo.updateInvestment(request);
	}

	async deleteInvestment(request: z4.infer<typeof DeleteIdSchema>) {
		return this.repo.deleteInvestment(request);
	}

	async getUserAccounts(request: z4.infer<typeof UserIdSchema>) {
		return this.repo.getUserAccounts(request);
	}

	async getUserInvestments(request: z4.infer<typeof UserIdSchema>) {
		return this.repo.getUserInvestments(request);
	}

	async getOptions(request: z4.infer<typeof UserIdSchema>) {
		return this.repo.getOptions(request);
	}
}

export const acctService = new AcctService();
