import { createServerFn } from "@tanstack/react-start";
import { assertAuthMiddleware } from "@/api/auth/auth.middleware";
import { withMetaLogger } from "@/api/logger/logger.middleware";
import {
	DeleteIdSchema,
	PaymentSchema,
	ScheduleSchema,
} from "@/lib/zod/osian.schema";
import { osianService } from "./osian.service";

export const createPayment = createServerFn()
	.middleware([
		assertAuthMiddleware,
		withMetaLogger("/payments", "createPayment"),
	])
	.validator(PaymentSchema)
	.handler(async ({ data }) => {
		return osianService.createPayment(data);
	});

export const updatePayment = createServerFn()
	.middleware([
		assertAuthMiddleware,
		withMetaLogger("/payments", "updatePayment"),
	])
	.validator(PaymentSchema)
	.handler(async ({ data }) => {
		return osianService.updatePayment(data);
	});

export const deletePayment = createServerFn()
	.middleware([
		assertAuthMiddleware,
		withMetaLogger("/payments", "deletePayment"),
	])
	.validator(DeleteIdSchema)
	.handler(async ({ data }) => {
		return osianService.deletePayment(data);
	});

export const updateSchedule = createServerFn()
	.middleware([
		assertAuthMiddleware,
		withMetaLogger("/schedule", "updateSchedule"),
	])
	.validator(ScheduleSchema)
	.handler(async ({ data }) => {
		return osianService.updateSchedule(data);
	});

export const getPayments = createServerFn()
	.middleware([
		assertAuthMiddleware,
		withMetaLogger("/payments", "getPayments"),
	])
	.handler(async ({ context }) => {
		return osianService.getPayments({ clerkId: context.userId });
	});

export const getSchedule = createServerFn()
	.middleware([
		assertAuthMiddleware,
		withMetaLogger("/schedule", "getSchedule"),
	])
	.handler(async ({ context }) => {
		return osianService.getSchedule({ clerkId: context.userId });
	});
