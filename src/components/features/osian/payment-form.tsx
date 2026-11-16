import { useUser } from "@clerk/tanstack-react-start";
import { format } from "date-fns";
import { useState } from "react";
import {
	useCreatePayment,
	useDeletePayment,
	useUpdatePayment,
} from "@/api/osian/osian.mutations";
import { useAppForm } from "@/components/shared/form-inputs/hooks";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	PAYMENT_SOURCE,
	PAYMENT_SOURCE_OPTIONS,
	PAYMENT_TYPE,
	PAYMENT_TYPE_OPTIONS,
} from "@/lib/constants";
import { capitalise } from "@/lib/utils";
import { PaymentSchema } from "@/lib/zod/osian.schema";
import type { Payment } from "@/types";

type Props = {
	payment?: Payment;
	id?: number;
	isDelete?: boolean;
};
export function PaymentForm({ payment, id }: Props) {
	const [isDelete, setIsDelete] = useState(false);
	const [isCopy, setIsCopy] = useState(false);

	const { mutate: createPayment, isPending: isPendingCreate } =
		useCreatePayment();
	const { mutate: updatePayment, isPending: isPendingUpdate } =
		useUpdatePayment();
	const { mutate: deletePayment, isPending: isPendingDelete } =
		useDeletePayment();
	const { user, isLoaded, isSignedIn } = useUser();

	const typeOptions = PAYMENT_TYPE_OPTIONS.map((t) => ({
		label: capitalise(t),
		value: t,
	}));
	const sourceOptions = PAYMENT_SOURCE_OPTIONS.map((t) => ({
		label: capitalise(t),
		value: t,
	}));

	const form = useAppForm({
		defaultValues: {
			rowNumber: id ?? 0,
			userId: user?.id as string,
			description: payment?.description ?? "",
			date: format(
				payment?.date ? new Date(payment.date) : new Date(),
				"yyyy-MM-dd",
			),
			source: payment?.source ?? PAYMENT_SOURCE.SELF,
			type: payment?.type ?? PAYMENT_TYPE.BANKEMI,
			amount: payment?.amount ?? 0,
		},
		validators: { onSubmit: PaymentSchema },
		onSubmit: async ({ value }) => {
			// console.log("Submitting form with value:", value);
			if (id && !isCopy) updatePayment({ data: value });
			else createPayment({ data: value });
		},
	});

	const loading = isPendingCreate || isPendingUpdate || isPendingDelete;
	if (loading || !isLoaded) return <Skeleton className="h-40 w-80 m-auto" />;
	if (!isSignedIn || !user.id) return;

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<form.AppForm>
				<div className="flex flex-col gap-6">
					<form.ErrorMap />

					<form.AppField name="description">
						{(field) => (
							<field.TextInput
								label={"Description"}
								disabled={isDelete || isCopy || loading}
							/>
						)}
					</form.AppField>

					<div className="flex md:flex-row flex-col gap-6 md:justify-between md:gap-4">
						<form.AppField name="date">
							{(field) => {
								return (
									<field.DateInput
										label="Date"
										disabled={isDelete || loading}
									/>
								);
							}}
						</form.AppField>
						<div className="flex w-full  gap-4 md:justify-between">
							<form.AppField name="source">
								{(field) => {
									return (
										<field.SelectInput
											variant={
												field.state.value === PAYMENT_SOURCE.BANK
													? "destructive"
													: "secondary"
											}
											label={"Payment Source"}
											disabled={isDelete || isCopy || loading}
											options={sourceOptions}
										/>
									);
								}}
							</form.AppField>

							<form.AppField name="type">
								{(field) => {
									return (
										<field.SelectInput
											variant="secondary"
											label={"Payment Type"}
											disabled={isDelete || isCopy || loading}
											options={typeOptions}
										/>
									);
								}}
							</form.AppField>
						</div>
					</div>

					<form.AppField name="amount">
						{(field) => (
							<field.AmountInput
								label={"Amount"}
								disabled={isDelete || isCopy || loading}
							/>
						)}
					</form.AppField>

					{isDelete && !!id ? (
						<Button
							variant={"destructive"}
							type="button"
							className="w-full"
							isLoading={loading}
							onClick={() =>
								deletePayment({
									data: { userId: user.id, rowNumber: id },
								})
							}
						>
							Confirm Delete
						</Button>
					) : (
						<div className="flex items-center justify-end gap-4">
							{payment?.type === PAYMENT_TYPE.BANKEMI && !isCopy && (
								<Button
									type="button"
									variant={"secondary"}
									onClick={() => {
										setIsCopy(true);
										form.setFieldValue(
											"date",
											format(new Date(), "yyyy-MM-dd"),
										);
									}}
								>
									Next Installment
								</Button>
							)}

							{!isCopy && (
								<Button
									type="button"
									variant={"destructive"}
									onClick={() => setIsDelete(true)}
								>
									Delete
								</Button>
							)}

							<form.SubmitButton
								label={isCopy ? "Save" : "Update"}
								isLoading={loading}
							/>
						</div>
					)}
				</div>
			</form.AppForm>
		</form>
	);
}
