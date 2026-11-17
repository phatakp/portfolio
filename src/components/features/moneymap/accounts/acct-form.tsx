import { useUser } from "@clerk/tanstack-react-start";
import { useSelector } from "@tanstack/react-form";
import { useState } from "react";
import { useGetBankOptions } from "@/api/moneymap/acct.getters";
import {
	useCreateAccount,
	useDeleteAccount,
	useUpdateAccount,
} from "@/api/moneymap/acct.mutations";
import { useAppForm } from "@/components/shared/form-inputs/hooks";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	ACCOUNT_TYPE,
	ACCOUNT_TYPE_OPTIONS,
	CLASSIFICATION,
} from "@/lib/constants";
import { capitalise, cn } from "@/lib/utils";
import { AcctReqSchema } from "@/lib/zod/acct.schema";
import type { Account } from "@/types";

type Props = {
	acct?: Account;
	acctId?: number;
	isModal?: boolean;
	isCash?: boolean;
};
export function AcctForm({
	acct,
	acctId,
	isModal = true,
	isCash: hasCash,
}: Props) {
	const [isDelete, setIsDelete] = useState(false);
	const { mutate: createAccount, isPending: isPendingCreate } =
		useCreateAccount(isModal);
	const { mutate: updateAccount, isPending: isPendingUpdate } =
		useUpdateAccount();
	const { mutate: deleteAccount, isPending: isPendingDelete } =
		useDeleteAccount();
	const { user, isLoaded, isSignedIn } = useUser();

	const form = useAppForm({
		defaultValues: {
			rowNumber: acctId ?? 0,
			userId: user?.id as string,
			email: user?.primaryEmailAddress?.emailAddress as string,
			userName: user?.fullName as string,
			bank: acct?.bank ?? "",
			acctType: acct?.acctType ?? ACCOUNT_TYPE.SAVINGS,
			acctNumber: acct?.acctNumber ?? "",
			balance: acct?.balance ?? 0,
			currValue: acct?.currValue ?? 0,
			remarks: acct?.remarks,
			classification: acct?.classification ?? CLASSIFICATION.ASSET,
			asOfDate: acct?.asOfDate ? new Date(acct.asOfDate) : new Date(),
		},
		validators: { onSubmit: AcctReqSchema },
		onSubmit: async ({ value }) => {
			// console.log("Submitting form with value:", value);
			if (acctId) updateAccount({ data: value });
			else createAccount({ data: value });
			form.reset();
		},
	});

	const acctType = useSelector(form.store, (state) => state.values.acctType);
	const bank = useSelector(form.store, (state) => state.values.bank);

	const { data: bankOptions, isLoading } = useGetBankOptions(acctType, hasCash);

	const loading = isPendingCreate || isPendingUpdate || isPendingDelete;
	if (loading || !isLoaded) return <Skeleton className="h-40 w-80 m-auto" />;
	if (!isSignedIn || !user.id) return;
	const isCash = bank.toLowerCase() === "cash";

	return (
		<form
			className="flex flex-col gap-6"
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<form.AppForm>
				<form.ErrorMap />

				<form.AppField
					name="acctType"
					listeners={{
						onChange: ({ value }) => {
							form.setErrorMap({});
							form.setFieldValue("acctNumber", "");
							form.setFieldValue("balance", 0);
							form.setFieldValue("currValue", 0);
							form.setFieldValue("bank", "");
							form.setFieldValue("remarks", "");

							if (
								value === ACCOUNT_TYPE.CREDIT_CARD ||
								value === ACCOUNT_TYPE.MORTGAGE
							) {
								form.setFieldValue("classification", CLASSIFICATION.LIABILITY);
							} else form.setFieldValue("classification", CLASSIFICATION.ASSET);
						},
					}}
				>
					{(field) => (
						<div className="flex gap-4 justify-between">
							<field.SelectInput
								label="Acct Type"
								variant={
									acct?.classification === CLASSIFICATION.LIABILITY
										? "destructive"
										: acct
											? "success"
											: "outline"
								}
								disabled={isDelete || !!acctId || loading}
								options={ACCOUNT_TYPE_OPTIONS.filter(
									(t) => t !== ACCOUNT_TYPE.INVESTMENT,
								).map((t) => ({
									value: t,
									label: capitalise(t),
								}))}
							/>

							<form.AppField
								name="bank"
								listeners={{
									onChange: ({ value }) => {
										if (value.toLowerCase() === "cash")
											form.setFieldValue("acctNumber", "0000");
									},
								}}
							>
								{(field) => {
									return (
										<field.SelectInput
											label={"Bank"}
											isLoading={isLoading}
											variant={acct ? "secondary" : "outline"}
											disabled={isDelete || !!acctId || loading}
											options={bankOptions ?? []}
										/>
									);
								}}
							</form.AppField>
						</div>
					)}
				</form.AppField>

				<div className="flex gap-4 justify-between">
					{!isCash && (
						<form.AppField name="acctNumber">
							{(field) => (
								<field.TextInput
									label={"Acct Number"}
									disabled={isDelete || loading}
									formatValue
								/>
							)}
						</form.AppField>
					)}

					<form.AppField
						name="balance"
						listeners={{
							onChange: ({ value }) => form.setFieldValue("currValue", value),
							onChangeDebounceMs: 500,
						}}
					>
						{(field) => (
							<field.AmountInput
								label={"Acct Balance"}
								disabled={isDelete || loading}
								className={cn((isDelete || loading) && "w-fit")}
							/>
						)}
					</form.AppField>
				</div>

				<form.AppField name="remarks">
					{(field) => (
						<field.TextInput label={"Remarks"} disabled={isDelete || loading} />
					)}
				</form.AppField>

				{isDelete && !!acctId ? (
					<Button
						variant={"destructive"}
						type="button"
						className="w-full"
						isLoading={loading}
						onClick={() =>
							deleteAccount({ data: { userId: user.id, rowNumber: acctId } })
						}
					>
						Confirm Delete
					</Button>
				) : (
					<div className="flex items-center justify-end gap-4">
						<Button
							variant={"destructive"}
							type="button"
							onClick={() => setIsDelete(true)}
							className={cn((isCash || !acctId) && "hidden")}
						>
							Delete
						</Button>
						<form.SubmitButton label="Submit" isLoading={loading} />
					</div>
				)}
			</form.AppForm>
		</form>
	);
}
