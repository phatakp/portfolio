import { useUser } from "@clerk/tanstack-react-start";
import { useSelector } from "@tanstack/react-form";
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
	isDelete?: boolean;
};
export function AcctForm({ acct, acctId, isDelete }: Props) {
	const { mutate: createAccount, isPending: isPendingCreate } =
		useCreateAccount();
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
		},
	});

	const acctType = useSelector(form.store, (state) => state.values.acctType);

	const { data: bankOptions, isLoading } = useGetBankOptions(acctType);

	const loading =
		isLoading || isPendingCreate || isPendingUpdate || isPendingDelete;
	if (loading || !isLoaded) return <Skeleton className="h-40 w-80 m-auto" />;
	if (!isSignedIn || !user.id) return;

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
							form.setFieldValue("acctType", value);
							form.setFieldValue("acctNumber", "");
							form.setFieldValue("balance", 0);
							form.setFieldValue("currValue", 0);
							form.setFieldValue("bank", "");
							form.setFieldValue("remarks", "");
							if (
								[ACCOUNT_TYPE.CREDIT_CARD, ACCOUNT_TYPE.MORTGAGE].includes(
									value,
								)
							)
								form.setFieldValue("classification", CLASSIFICATION.LIABILITY);
							else form.setFieldValue("classification", CLASSIFICATION.ASSET);
						},
					}}
				>
					{(field) => (
						<div className="flex md:gap-4 md:flex-row flex-col gap-6 justify-between">
							<div className="flex gap-4 justify-between">
								<field.SelectInput
									label="Acct Type"
									variant={
										acct?.classification === CLASSIFICATION.LIABILITY
											? "destructive"
											: "success"
									}
									disabled={isDelete || !!acctId || loading}
									options={ACCOUNT_TYPE_OPTIONS.map((t) => ({
										value: t,
										label: capitalise(t),
									}))}
									className={cn(
										acctId && acct?.classification === CLASSIFICATION.ASSET
											? "bg-success text-success-foreground"
											: acctId
												? "bg-destructive text-destructive-foreground"
												: "",
									)}
								/>

								<form.AppField name="bank">
									{(field) => {
										let options = bankOptions ?? [];
										if (!acctId)
											options =
												bankOptions?.filter(
													(b) => b.value.toLowerCase() !== "cash",
												) ?? [];
										return (
											<field.SelectInput
												label={"Bank"}
												variant="default"
												disabled={isDelete || !!acctId || loading}
												options={!acctId ? options : (bankOptions ?? [])}
											/>
										);
									}}
								</form.AppField>
							</div>

							<form.AppField name="acctNumber">
								{(field) => (
									<field.TextInput
										label={"Acct Number"}
										disabled={
											isDelete ||
											loading ||
											form.getFieldValue("bank").toLowerCase() === "cash"
										}
										formatValue
									/>
								)}
							</form.AppField>
						</div>
					)}
				</form.AppField>

				<div className="flex flex-col gap-6 md:flex-row md:gap-4">
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
					<form.SubmitButton
						label="Submit"
						className="w-full"
						isLoading={loading}
					/>
				)}
			</form.AppForm>
		</form>
	);
}
