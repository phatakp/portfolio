import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useModal } from "@/components/shared/modal";
import { errorToast, successToast } from "@/integrations/react-toast";
import {
	createAccount,
	createInvestment,
	deleteAccount,
	deleteInvestment,
	updateAccount,
	updateInvestment,
} from "./acct.functions";
import { apiQueries } from "./queries";

export function useCreateAccount() {
	const queryClient = useQueryClient();
	const { modalId, closeModal } = useModal();
	return useMutation({
		mutationFn: createAccount,
		onError: (error) => {
			errorToast(
				"INVALID_REQUEST",
				error.message ?? "Could not process request",
			);
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: apiQueries.account.userAccts(variables.data.userId).queryKey,
			});
			closeModal(modalId);
			successToast(`Account created successfully`);
		},
	});
}

export function useUpdateAccount() {
	const queryClient = useQueryClient();
	const { modalId, closeModal } = useModal();
	return useMutation({
		mutationFn: updateAccount,
		onError: (error) => {
			errorToast(
				"INVALID_REQUEST",
				error.message ?? "Could not process request",
			);
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: apiQueries.account.userAccts(variables.data.userId).queryKey,
			});
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
		onError: (error) => {
			errorToast(
				"INVALID_REQUEST",
				error.message ?? "Could not process request",
			);
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: apiQueries.account.userAccts(variables.data.userId).queryKey,
			});
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
		onError: (error) => {
			errorToast(
				"INVALID_REQUEST",
				error.message ?? "Could not process request",
			);
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: apiQueries.investment.userInvestments(variables.data.userId)
					.queryKey,
			});
			closeModal(modalId);
			successToast(`Investment created successfully`);
		},
	});
}

export function useUpdateInvestment() {
	const queryClient = useQueryClient();
	const { modalId, closeModal } = useModal();
	return useMutation({
		mutationFn: updateInvestment,
		onError: (error) => {
			errorToast(
				"INVALID_REQUEST",
				error.message ?? "Could not process request",
			);
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: apiQueries.investment.userInvestments(variables.data.userId)
					.queryKey,
			});
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
		onError: (error) => {
			errorToast(
				"INVALID_REQUEST",
				error.message ?? "Could not process request",
			);
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: apiQueries.investment.userInvestments(variables.data.userId)
					.queryKey,
			});
			closeModal(modalId);
			successToast(`Investment deleted successfully`);
		},
	});
}
