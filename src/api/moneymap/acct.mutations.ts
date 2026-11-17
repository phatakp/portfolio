import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useModal } from "@/components/shared/modal";
import { errorToast, successToast } from "@/integrations/react-toast";
import type { AcctResponse, APIResponse, InvResponse } from "@/types";
import {
	createAccount,
	createInvestment,
	deleteAccount,
	deleteInvestment,
	updateAccount,
	updateInvestment,
} from "./acct.functions";
import { apiQueries } from "./queries";

export function useCreateAccount(isModal: boolean) {
	const queryClient = useQueryClient();
	const { modalId, closeModal } = useModal();
	return useMutation({
		mutationFn: createAccount,
		onMutate: async (variables) => {
			// 1) Cancel in-flight refetches to prevent race conditions
			await queryClient.cancelQueries({
				queryKey: apiQueries.account.all().queryKey,
			});
			// 2) Snapshot the previous state (for rollback)
			const previous = queryClient.getQueryData<APIResponse<AcctResponse>>(
				apiQueries.account.all().queryKey,
			);
			// 3) Optimistically update the cache
			queryClient.setQueryData(
				apiQueries.account.all().queryKey,
				(old?: APIResponse<AcctResponse>) => {
					const { rowNumber, ...input } = variables.data;
					if (!old)
						return {
							success: true,
							status: 200,
							count: 1,
							records: [{ rowNumber: variables.data.rowNumber, record: input }],
						} as APIResponse<AcctResponse>;

					return {
						success: old.success,
						status: old.status,
						count: old.count + 1,
						records: [
							...old.records,
							{ rowNumber: variables.data.rowNumber, record: input },
						],
					} as APIResponse<AcctResponse>;
				},
			);
			return { previous };
		},
		onSettled: () => {
			return queryClient.invalidateQueries({
				queryKey: apiQueries.account.all().queryKey,
			});
		},
		onError: (error, _, context) => {
			errorToast(
				"INVALID_REQUEST",
				error.message ?? "Could not process request",
			);
			queryClient.setQueryData(
				apiQueries.account.all().queryKey,
				context?.previous,
			);
		},
		onSuccess: () => {
			if (isModal) closeModal(modalId);
			successToast(`Account created successfully`);
		},
	});
}

export function useUpdateAccount() {
	const queryClient = useQueryClient();
	const { modalId, closeModal } = useModal();
	return useMutation({
		mutationFn: updateAccount,
		onMutate: async (variables) => {
			// 1) Cancel in-flight refetches to prevent race conditions
			await queryClient.cancelQueries({
				queryKey: apiQueries.account.all().queryKey,
			});
			// 2) Snapshot the previous state (for rollback)
			const previous = queryClient.getQueryData<APIResponse<AcctResponse>>(
				apiQueries.account.all().queryKey,
			);
			// 3) Optimistically update the cache
			queryClient.setQueryData(
				apiQueries.account.all().queryKey,
				(old?: APIResponse<AcctResponse>) => {
					const { rowNumber, ...input } = variables.data;
					if (!old)
						return {
							success: true,
							status: 200,
							count: 1,
							records: [{ rowNumber: variables.data.rowNumber, record: input }],
						} as APIResponse<AcctResponse>;

					return {
						success: old.success,
						status: old.status,
						count: old.count,
						records: old.records.map((r) =>
							r.rowNumber === rowNumber ? { rowNumber, record: input } : r,
						),
					} as APIResponse<AcctResponse>;
				},
			);
			return { previous };
		},
		onSettled: () => {
			return queryClient.invalidateQueries({
				queryKey: apiQueries.account.all().queryKey,
			});
		},
		onError: (error, _, context) => {
			errorToast(
				"INVALID_REQUEST",
				error.message ?? "Could not process request",
			);
			queryClient.setQueryData(
				apiQueries.account.all().queryKey,
				context?.previous,
			);
		},
		onSuccess: () => {
			closeModal(modalId);
			successToast(`Account updated successfully`);
		},
	});
}

export function useDeleteAccount() {
	const queryClient = useQueryClient();
	const { modalId, closeModal } = useModal();
	return useMutation({
		mutationFn: deleteAccount,
		onMutate: async (variables) => {
			// 1) Cancel in-flight refetches to prevent race conditions
			await queryClient.cancelQueries({
				queryKey: apiQueries.account.all().queryKey,
			});
			// 2) Snapshot the previous state (for rollback)
			const previous = queryClient.getQueryData<APIResponse<AcctResponse>>(
				apiQueries.account.all().queryKey,
			);
			// 3) Optimistically update the cache
			queryClient.setQueryData(
				apiQueries.account.all().queryKey,
				(old?: APIResponse<AcctResponse>) => {
					const { rowNumber } = variables.data;
					if (!old)
						return {
							success: true,
							status: 204,
							count: 0,
							records: [],
						} as APIResponse<AcctResponse>;

					return {
						success: old.success,
						status: old.status,
						count: old.count - 1,
						records: old.records.filter((r) => r.rowNumber !== rowNumber),
					} as APIResponse<AcctResponse>;
				},
			);
			return { previous };
		},
		onSettled: () => {
			return queryClient.invalidateQueries({
				queryKey: apiQueries.account.all().queryKey,
			});
		},
		onError: (error, _, context) => {
			errorToast(
				"INVALID_REQUEST",
				error.message ?? "Could not process request",
			);
			queryClient.setQueryData(
				apiQueries.account.all().queryKey,
				context?.previous,
			);
		},
		onSuccess: () => {
			closeModal(modalId);
			successToast(`Account deleted successfully`);
		},
	});
}

export function useCreateInvestment() {
	const queryClient = useQueryClient();
	const { modalId, closeModal } = useModal();
	return useMutation({
		mutationFn: createInvestment,
		onMutate: async (variables) => {
			// 1) Cancel in-flight refetches to prevent race conditions
			await queryClient.cancelQueries({
				queryKey: apiQueries.investment.all().queryKey,
			});
			// 2) Snapshot the previous state (for rollback)
			const previous = queryClient.getQueryData<APIResponse<InvResponse>>(
				apiQueries.investment.all().queryKey,
			);
			// 3) Optimistically update the cache
			queryClient.setQueryData(
				apiQueries.investment.all().queryKey,
				(old?: APIResponse<InvResponse>) => {
					const { rowNumber, ...input } = variables.data;
					if (!old)
						return {
							success: true,
							status: 200,
							count: 1,
							records: [{ rowNumber, record: input }],
						} as APIResponse<InvResponse>;

					return {
						success: old.success,
						status: old.status,
						count: old.count + 1,
						records: [...old.records, { rowNumber, record: input }],
					} as APIResponse<InvResponse>;
				},
			);
			return { previous };
		},
		onSettled: () => {
			return queryClient.invalidateQueries({
				queryKey: apiQueries.investment.all().queryKey,
			});
		},
		onError: (error, _, context) => {
			errorToast(
				"INVALID_REQUEST",
				error.message ?? "Could not process request",
			);
			queryClient.setQueryData(
				apiQueries.investment.all().queryKey,
				context?.previous,
			);
		},
		onSuccess: () => {
			closeModal(modalId);
			successToast(`Investment added successfully`);
		},
	});
}

export function useUpdateInvestment() {
	const queryClient = useQueryClient();
	const { modalId, closeModal } = useModal();
	return useMutation({
		mutationFn: updateInvestment,
		onMutate: async (variables) => {
			// 1) Cancel in-flight refetches to prevent race conditions
			await queryClient.cancelQueries({
				queryKey: apiQueries.investment.all().queryKey,
			});
			// 2) Snapshot the previous state (for rollback)
			const previous = queryClient.getQueryData<APIResponse<InvResponse>>(
				apiQueries.investment.all().queryKey,
			);
			// 3) Optimistically update the cache
			queryClient.setQueryData(
				apiQueries.investment.all().queryKey,
				(old?: APIResponse<InvResponse>) => {
					const { rowNumber, ...input } = variables.data;
					if (!old)
						return {
							success: true,
							status: 200,
							count: 1,
							records: [{ rowNumber, record: input }],
						} as APIResponse<InvResponse>;

					return {
						success: old.success,
						status: old.status,
						count: old.count,
						records: old.records.map((o) =>
							o.rowNumber === rowNumber ? { rowNumber, record: input } : o,
						),
					} as APIResponse<InvResponse>;
				},
			);
			return { previous };
		},
		onSettled: () => {
			return queryClient.invalidateQueries({
				queryKey: apiQueries.investment.all().queryKey,
			});
		},
		onError: (error, _, context) => {
			errorToast(
				"INVALID_REQUEST",
				error.message ?? "Could not process request",
			);
			queryClient.setQueryData(
				apiQueries.investment.all().queryKey,
				context?.previous,
			);
		},
		onSuccess: () => {
			closeModal(modalId);
			successToast(`Investment updated successfully`);
		},
	});
}

export function useDeleteInvestment() {
	const queryClient = useQueryClient();
	const { modalId, closeModal } = useModal();
	return useMutation({
		mutationFn: deleteInvestment,
		onMutate: async (variables) => {
			// 1) Cancel in-flight refetches to prevent race conditions
			await queryClient.cancelQueries({
				queryKey: apiQueries.investment.all().queryKey,
			});
			// 2) Snapshot the previous state (for rollback)
			const previous = queryClient.getQueryData<APIResponse<InvResponse>>(
				apiQueries.investment.all().queryKey,
			);
			// 3) Optimistically update the cache
			queryClient.setQueryData(
				apiQueries.investment.all().queryKey,
				(old?: APIResponse<InvResponse>) => {
					const { rowNumber } = variables.data;
					if (!old)
						return {
							success: true,
							status: 204,
							count: 0,
							records: [],
						} as APIResponse<InvResponse>;

					return {
						success: old.success,
						status: old.status,
						count: old.count - 1,
						records: old.records.filter((r) => r.rowNumber !== rowNumber),
					} as APIResponse<InvResponse>;
				},
			);
			return { previous };
		},
		onSettled: () => {
			return queryClient.invalidateQueries({
				queryKey: apiQueries.investment.all().queryKey,
			});
		},
		onError: (error, _, context) => {
			errorToast(
				"INVALID_REQUEST",
				error.message ?? "Could not process request",
			);
			queryClient.setQueryData(
				apiQueries.investment.all().queryKey,
				context?.previous,
			);
		},
		onSuccess: () => {
			closeModal(modalId);
			successToast(`Investment deleted successfully`);
		},
	});
}
