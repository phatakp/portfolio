import { createServerFn } from "@tanstack/react-start";
import { assertAuthMiddleware } from "@/api/auth/auth.middleware";
import { withMetaLogger } from "@/api/logger/logger.middleware";
import {
	AcctReqSchema,
	DeleteIdSchema,
	InvReqSchema,
} from "@/lib/zod/acct.schema";
import { acctService } from "./acct.service";

export const createAccount = createServerFn()
	.middleware([
		assertAuthMiddleware,
		withMetaLogger("/accounts", "createAccount"),
	])
	.validator(AcctReqSchema)
	.handler(async ({ data }) => {
		return acctService.createAccount(data);
	});

export const updateAccount = createServerFn()
	.middleware([
		assertAuthMiddleware,
		withMetaLogger("/accounts", "updateAccount"),
	])
	.validator(AcctReqSchema)
	.handler(async ({ data }) => {
		return acctService.updateAccount(data);
	});

export const deleteAccount = createServerFn()
	.middleware([
		assertAuthMiddleware,
		withMetaLogger("/accounts", "deleteAccount"),
	])
	.validator(DeleteIdSchema)
	.handler(async ({ data }) => {
		return acctService.deleteAccount(data);
	});

export const createInvestment = createServerFn()
	.middleware([
		assertAuthMiddleware,
		withMetaLogger("/investments", "createInvestment"),
	])
	.validator(InvReqSchema)
	.handler(async ({ data }) => {
		return acctService.createInvestment(data);
	});

export const updateInvestment = createServerFn()
	.middleware([
		assertAuthMiddleware,
		withMetaLogger("/investments", "updateInvestment"),
	])
	.validator(InvReqSchema)
	.handler(async ({ data }) => {
		return acctService.updateInvestment(data);
	});

export const deleteInvestment = createServerFn()
	.middleware([
		assertAuthMiddleware,
		withMetaLogger("/investments", "deleteInvestment"),
	])
	.validator(DeleteIdSchema)
	.handler(async ({ data }) => {
		return acctService.deleteInvestment(data);
	});

export const getUserAccounts = createServerFn()
	.middleware([
		assertAuthMiddleware,
		withMetaLogger("/accounts", "getUserAccounts"),
	])
	.handler(async ({ context }) => {
		return acctService.getUserAccounts({ clerkId: context.userId });
	});

export const getUserInvestments = createServerFn()
	.middleware([
		assertAuthMiddleware,
		withMetaLogger("/investments", "getUserInvestments"),
	])
	.handler(async ({ context }) => {
		return acctService.getUserInvestments({ clerkId: context.userId });
	});
