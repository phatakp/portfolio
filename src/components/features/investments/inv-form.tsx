import { useUser } from "@clerk/tanstack-react-start";
import { useSelector } from "@tanstack/react-form";
import { useGetBankOptions } from "@/api/moneymap/acct.getters";
import {
	useCreateInvestment,
	useDeleteInvestment,
	useUpdateInvestment,
} from "@/api/moneymap/acct.mutations";
import { useAppForm } from "@/components/shared/form-inputs/hooks";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	ACCOUNT_TYPE,
	INVESTMENT_SUBTYPE,
	INVESTMENT_SUBTYPE_OPTIONS,
	INVESTMENT_TYPE,
	INVESTMENT_TYPE_OPTIONS,
} from "@/lib/constants";
import { capitalise, cn } from "@/lib/utils";
import { InvReqSchema } from "@/lib/zod/acct.schema";
import type { Investment } from "@/types";

type Props = {
	inv?: Investment;
	invId?: number;
	isDelete?: boolean;
};
export function InvForm({ inv, invId, isDelete }: Props) {
	const { mutate: createInvestment, isPending: isPendingCreate } =
		useCreateInvestment();
	const { mutate: updateInvestment, isPending: isPendingUpdate } =
		useUpdateInvestment();
	const { mutate: deleteInvestment, isPending: isPendingDelete } =
		useDeleteInvestment();
	const { user, isLoaded, isSignedIn } = useUser();

	const form = useAppForm({
		defaultValues: {
			rowNumber: invId ?? 0,
			userId: user?.id as string,
			email: user?.primaryEmailAddress?.emailAddress as string,
			userName: user?.fullName as string,
			fundName: inv?.fundName ?? "",
			broker: inv?.broker ?? "",
			invType: inv?.invType ?? INVESTMENT_TYPE.EQUITY,
			subType: inv?.subType ?? INVESTMENT_SUBTYPE.EQUITY,
			category: inv?.category ?? "",
			googleCode: inv?.googleCode ?? "",
			investedAmt: inv?.investedAmt ?? 0,
			quantity: inv?.quantity ?? 0,
			currValue: inv?.currValue ?? 0,
			avgPrice: Number(inv?.avgPrice?.toFixed(2) ?? 0),
			sip: inv?.sip ?? 0,
			remarks: inv?.remarks,
		},
		validators: { onSubmit: InvReqSchema },
		onSubmit: async ({ value }) => {
			// console.log("Submitting form with value:", value);
			if (invId) updateInvestment({ data: value });
			else createInvestment({ data: value });
		},
	});

	const invType = useSelector(form.store, (state) => state.values.invType);
	const isDeposit = [
		INVESTMENT_TYPE.DEPOSIT,
		INVESTMENT_TYPE.RETIREMENT,
	].includes(invType);

	const { data: brokerOptions, isLoading } = useGetBankOptions(
		ACCOUNT_TYPE.INVESTMENT,
	);

	const subTypeOptions = INVESTMENT_SUBTYPE_OPTIONS.map((t) => ({
		value: t,
		label: capitalise(t),
	}));

	const loading =
		isLoading || isPendingCreate || isPendingUpdate || isPendingDelete;
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

					<form.AppField
						name="invType"
						listeners={{
							onChange: ({ value }) => {
								form.setErrorMap({});
								form.setFieldValue("invType", value);
								form.setFieldValue("fundName", "");
								if (value === INVESTMENT_TYPE.DEPOSIT)
									form.setFieldValue("subType", INVESTMENT_SUBTYPE.DEBT);
								else form.setFieldValue("subType", "");
								form.setFieldValue("broker", "");
								form.setFieldValue("category", "");
								form.setFieldValue("googleCode", "");
								form.setFieldValue("investedAmt", 0);
								form.setFieldValue("quantity", 0);
								form.setFieldValue("avgPrice", 0);
								form.setFieldValue("sip", 0);
								form.setFieldValue("remarks", "");
							},
						}}
					>
						{(field) => (
							<div className="flex md:flex-row flex-col gap-6 md:justify-between md:gap-4">
								<div className="flex w-full  gap-4 md:justify-between">
									<field.SelectInput
										label="Investment Type"
										variant="success"
										disabled={isDelete || !!invId || loading}
										options={INVESTMENT_TYPE_OPTIONS.map((t) => ({
											value: t,
											label: capitalise(t),
										}))}
										className={cn(
											invId ? "bg-success text-success-foreground" : "",
										)}
									/>

									<form.AppField
										name="broker"
										listeners={{
											onChange: ({ value }) => {
												form.setFieldValue("broker", value);
												if (value === "NPS")
													form.setFieldValue(
														"subType",
														INVESTMENT_SUBTYPE.HYBRID,
													);
												else if (value === "EPF")
													form.setFieldValue(
														"subType",
														INVESTMENT_SUBTYPE.DEBT,
													);
											},
										}}
									>
										{(field) => {
											return (
												<field.SelectInput
													variant="default"
													label={"Bank"}
													disabled={isDelete || !!invId || loading}
													options={brokerOptions ?? []}
												/>
											);
										}}
									</form.AppField>
								</div>

								{!isDeposit && (
									<div className="flex w-full gap-4 md:justify-between">
										<form.AppField name="subType">
											{(field) => (
												<field.SelectInput
													label={"Sub Type"}
													disabled={isDelete || !!invId || loading}
													options={subTypeOptions}
												/>
											)}
										</form.AppField>

										<form.AppField name="category">
											{(field) => (
												<field.TextInput
													label={"Category"}
													disabled={isDelete || !!invId || loading}
												/>
											)}
										</form.AppField>
									</div>
								)}
							</div>
						)}
					</form.AppField>

					<div className="flex md:flex-row flex-col gap-6 md:justify-around">
						<form.AppField name="fundName">
							{(field) => (
								<field.TextInput
									label={"Fund Name"}
									disabled={isDelete || !!invId || loading}
								/>
							)}
						</form.AppField>

						{!isDeposit && (
							<form.AppField name="googleCode">
								{(field) => (
									<field.TextInput
										label={"Google Code"}
										disabled={isDelete || !!invId || loading}
									/>
								)}
							</form.AppField>
						)}
					</div>

					<div className="flex gap-4">
						<form.AppField name="investedAmt">
							{(field) => (
								<field.AmountInput
									label={"Invested Amount"}
									disabled={isDelete || loading}
								/>
							)}
						</form.AppField>

						{isDeposit ? (
							<form.AppField name="currValue">
								{(field) => (
									<field.AmountInput
										label={"Curr Value"}
										disabled={isDelete || loading}
									/>
								)}
							</form.AppField>
						) : (
							<form.AppField name="quantity">
								{(field) => (
									<field.TextInput
										type="number"
										label={"Quantity"}
										disabled={isDelete || loading}
									/>
								)}
							</form.AppField>
						)}
					</div>

					{!isDeposit && (
						<div className="flex gap-4">
							<form.AppField name="avgPrice">
								{(field) => (
									<field.AmountInput
										label={"Average Price"}
										disabled={isDelete || loading}
									/>
								)}
							</form.AppField>

							<form.AppField name="sip">
								{(field) => (
									<field.AmountInput
										label={"SIP Amount"}
										disabled={isDelete || loading}
									/>
								)}
							</form.AppField>
						</div>
					)}

					<form.AppField name="remarks">
						{(field) => (
							<field.TextInput
								label={"Remarks"}
								disabled={isDelete || loading}
							/>
						)}
					</form.AppField>

					{isDelete && !!invId ? (
						<Button
							variant={"destructive"}
							type="button"
							className="w-full"
							isLoading={loading}
							onClick={() =>
								deleteInvestment({
									data: { userId: user.id, rowNumber: invId },
								})
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
				</div>
			</form.AppForm>
		</form>
	);
}
