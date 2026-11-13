import { useSelector } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { apiQueries } from "@/api/moneymap/queries";
import { PaginationRibbon } from "@/components/shadcn-space/pagination/pagination-02";
import { Amount } from "@/components/shared/amount";
import { useAppForm } from "@/components/shared/form-inputs/hooks";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { INVESTMENT_TYPE } from "@/lib/constants";
import { capitalise } from "@/lib/utils";
import { Route } from "@/routes/moneymap/investments";
import type { InvType } from "@/types";
import { InvBtn } from "./inv-btn";
import { InvListItem } from "./inv-list-item";

type Props = {
	type: InvType;
};
export function InvList({ type }: Props) {
	const [activePage, setActivePage] = useState(1);

	const { auth } = Route.useRouteContext();
	const { data: resp } = useSuspenseQuery(
		apiQueries.investment.userInvestments(auth.userId as string),
	);

	const form = useAppForm({
		defaultValues: {
			broker: "all",
			category: "all",
		},
		onSubmit: async () => {},
	});
	const broker = useSelector(form.store, (state) => state.values.broker);
	const category = useSelector(form.store, (state) => state.values.category);

	useEffect(() => {
		if (!broker) form.setFieldValue("broker", "all");
		if (!category) form.setFieldValue("category", "all");
	}, [broker, category, form.setFieldValue]);

	const { data: brokerOptions } = useSuspenseQuery(
		apiQueries.investment.brokerOptions(resp?.records ?? []),
	);

	const { data: categoryOptions } = useSuspenseQuery(
		apiQueries.investment.categoryOptions(resp?.records ?? []),
	);

	const { data: accts } = useSuspenseQuery(
		apiQueries.investment.filteredInvestments(
			resp?.records ?? [],
			type,
			broker,
			category,
		),
	);

	const total =
		accts
			?.filter((record) => Number.isFinite(record.record.currValue))
			.reduce((acc, b) => acc + b.record.currValue, 0) ?? 0;
	const page = accts?.slice((activePage - 1) * 5, (activePage - 1) * 5 + 5);

	return (
		<div className="flex flex-col gap-6">
			<Card className="p-0 w-[calc(100vw-2rem)] md:w-full">
				<CardHeader className="gradient py-4 rounded-t-md">
					<CardTitle className="text-base md:text-xl tracking-wide capitalize text-muted-foreground">
						{broker === "all" ? `All ${capitalise(type)}` : capitalise(broker)}{" "}
						Investments
					</CardTitle>
					<CardDescription>
						<div className="flex items-center gap-2">
							<Amount
								amount={total}
								className="text-base md:text-2xl text-primary"
								shorten
							/>
							<span>
								in {accts?.length ?? 0} {capitalise(type)}(s)
							</span>
						</div>
					</CardDescription>
					<CardAction>
						<InvBtn />
					</CardAction>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-4 pb-2">
						<form
							className="flex flex-col gap-4"
							onSubmit={(e) => {
								e.preventDefault();
								form.handleSubmit();
							}}
						>
							<form.AppForm>
								{type === INVESTMENT_TYPE.MUTUAL_FUND && (
									<>
										{brokerOptions.length > 0 && (
											<form.AppField
												name="broker"
												listeners={{
													onChange: () => {
														// Accessing external state here will still be stale if it relies on closures,
														// but you can safely trigger state setters:
														setActivePage(1);
													},
												}}
											>
												{(field) => {
													return (
														<field.SelectInput
															defaultValue={"all"}
															value={broker}
															onChange={(e) => {
																field.setValue(e.target.value);
															}}
															label={"Broker"}
															options={brokerOptions}
														/>
													);
												}}
											</form.AppField>
										)}
										{categoryOptions.length > 0 && (
											<form.AppField
												name="category"
												listeners={{
													onChange: () => {
														// Accessing external state here will still be stale if it relies on closures,
														// but you can safely trigger state setters:
														setActivePage(1);
													},
												}}
											>
												{(field) => {
													return (
														<field.SelectInput
															defaultValue={"all"}
															value={category}
															onChange={(e) => {
																field.setValue(e.target.value);
															}}
															label={"Category"}
															options={categoryOptions}
														/>
													);
												}}
											</form.AppField>
										)}
									</>
								)}
							</form.AppForm>
						</form>
						{page?.map(({ record: inv, rowNumber }) => (
							<InvListItem key={rowNumber} invId={rowNumber} inv={inv} />
						))}
					</div>
				</CardContent>
				<CardFooter>
					<div className="flex justify-center items-center w-full pb-4">
						<PaginationRibbon
							count={accts?.length ?? 0}
							activePage={activePage}
							setActivePage={setActivePage}
						/>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
