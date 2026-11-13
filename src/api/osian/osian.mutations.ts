import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useModal } from "@/components/shared/modal";
import { errorToast, successToast } from "@/integrations/react-toast";
import {
	createPayment,
	deletePayment,
	updatePayment,
	updateSchedule,
} from "./osian.functions";
import { apiQueries } from "./queries";

export function useCreatePayment() {
	const queryClient = useQueryClient();
	const { modalId, closeModal } = useModal();
	return useMutation({
		mutationFn: createPayment,
		onError: (error) => {
			errorToast(
				"INVALID_REQUEST",
				error.message ?? "Could not process request",
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: apiQueries.payments.all().queryKey,
			});
			closeModal(modalId);
			successToast(`Payment created successfully`);
		},
	});
}

export function useUpdatePayment() {
	const queryClient = useQueryClient();
	const { modalId, closeModal } = useModal();
	return useMutation({
		mutationFn: updatePayment,
		onError: (error) => {
			errorToast(
				"INVALID_REQUEST",
				error.message ?? "Could not process request",
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: apiQueries.payments.all().queryKey,
			});
			closeModal(modalId);
			successToast(`Payment updated successfully`);
		},
	});
}

export function useDeletePayment() {
	const queryClient = useQueryClient();
	const { modalId, closeModal } = useModal();
	return useMutation({
		mutationFn: deletePayment,
		onError: (error) => {
			errorToast(
				"INVALID_REQUEST",
				error.message ?? "Could not process request",
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: apiQueries.payments.all().queryKey,
			});
			closeModal(modalId);
			successToast(`Payment deleted successfully`);
		},
	});
}

export function useUpdateSchedule() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateSchedule,
		onError: (error) => {
			errorToast(
				"INVALID_REQUEST",
				error.message ?? "Could not process request",
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: apiQueries.schedule.all().queryKey,
			});
			successToast(`Schedule updated successfully`);
		},
	});
}
