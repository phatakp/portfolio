import { useSelector } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import z4 from "zod/v4";
import {
	useGetAccounts,
	useGetUserAccounts,
} from "@/api/moneymap/acct.getters";
import { apiQueries } from "@/api/moneymap/queries";
import { Amount } from "@/components/shared/amount";
import { useAppForm } from "@/components/shared/form-inputs/hooks";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { capitalise } from "@/lib/utils";
import { Route } from "@/routes/moneymap/accounts";
import { useAppStore } from "@/stores/app.store";
import { AcctListItem } from "./acct-list-item";

export function AcctList() {
	const { auth } = Route.useRouteContext();
	const user = useAppStore((state) => state.user);
	const userId = user?.id ?? auth.userId;
	const { data: resp } = useGetAccounts();
	const { data: accts } = useGetUserAccounts(
		resp?.records ?? [],
		userId as string,
	);

	const form = useAppForm({
		defaultValues: {
			showBy: "type",
		},
		validators: { onChange: z4.object({ showBy: z4.enum(["type", "bank"]) }) },
		onSubmit: async () => {},
	});

	const showBy = useSelector(form.store, (state) => state.values.showBy);
	const acctByType = Object.groupBy(accts ?? [], ({ record }) =>
		showBy === "type" ? record.acctType : record.bank,
	);

	return (
		<div className="flex flex-col gap-8">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<form.AppForm>
					<form.AppField name="showBy">
						{(field) => {
							return (
								<field.SelectInput
									className="md:w-50"
									defaultValue={"type"}
									value={showBy}
									onChange={(e) => {
										field.setValue(e.target.value);
									}}
									label={"Show Accounts By"}
									options={[
										{ value: "type", label: "Account Type" },
										{ value: "bank", label: "Bank" },
									]}
								/>
							);
						}}
					</form.AppField>
				</form.AppForm>
			</form>

			{Object.entries(acctByType).map(([key, values]) => {
				const total =
					values?.reduce((acc, b) => acc + b.record.currValue, 0) ?? 0;
				return (
					<Card className="p-0 rounded-b-none" key={key}>
						<CardHeader className="py-2 rounded-t-md bg-muted">
							<CardTitle className="text-lg md:text-2xl">
								{capitalise(key)}
							</CardTitle>
							<CardAction>
								<Amount amount={total} className="text-base md:text-2xl" />
							</CardAction>
						</CardHeader>
						<CardContent className="p-0 -pt-4">
							<div className="flex flex-col">
								{values?.map(({ record: acct, rowNumber }, i) => (
									<AcctListItem
										key={rowNumber}
										acctId={rowNumber}
										acct={acct}
										showBy={showBy}
										isOdd={i % 2 === 1}
									/>
								))}
								{resp?.count === 0 && (
									<div className="mx-auto text-lg font-bold">
										You have not added any accounts yet
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
