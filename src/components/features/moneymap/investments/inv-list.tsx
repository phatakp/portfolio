import { useSelector } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
	useGetInvestments,
	useGetUserInvestments,
} from "@/api/moneymap/acct.getters";
import { apiQueries } from "@/api/moneymap/queries";
import { PaginationRibbon } from "@/components/shadcn-space/pagination/pagination-02";
import { Amount } from "@/components/shared/amount";
import { useAppForm } from "@/components/shared/form-inputs/hooks";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { INVESTMENT_TYPE } from "@/lib/constants";
import { capitalise } from "@/lib/utils";
import { Route } from "@/routes/moneymap/investments";
import { useAppStore } from "@/stores/app.store";
import type { InvType } from "@/types";
import { InvBtn } from "./inv-btn";
import { InvListItem } from "./inv-list-item";

type Props = {
	type: InvType;
};
export function InvList({ type }: Props) {
	const [activePage, setActivePage] = useState(1);
	const user = useAppStore((state) => state.user);
	const { auth } = Route.useRouteContext();
	const { data: resp } = useGetInvestments();
	const userId = user?.id ?? auth.userId;
	const { data: investments } = useGetUserInvestments(
		resp?.records ?? [],
		userId as string,
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
		apiQueries.investment.brokerOptions(investments ?? []),
	);

	const { data: categoryOptions } = useSuspenseQuery(
		apiQueries.investment.categoryOptions(investments ?? []),
	);

	const { data: accts } = useSuspenseQuery(
		apiQueries.investment.filteredInvestments(
			investments ?? [],
			type,
			broker,
			category,
		),
	);

	const overall =
		investments
			?.filter((record) => Number.isFinite(record.record.currValue))
			.reduce((acc, b) => acc + b.record.currValue, 0) ?? 0;

	const total =
		accts
			?.filter((record) => Number.isFinite(record.record.currValue))
			.reduce((acc, b) => acc + b.record.currValue, 0) ?? 0;
	const page = accts?.slice((activePage - 1) * 5, (activePage - 1) * 5 + 5);

	return (
		<div className="flex flex-col gap-6">
			<Card className="p-0 w-[calc(100vw-2rem)] md:w-full">
				<CardHeader className="gradient py-4 rounded-t-md">
					<div className="flex flex-col">
						<div className="flex justify-between">
							<span className="text-base md:text-lg tracking-wide capitalize text-muted-foreground">
								{broker === "all"
									? `All ${type === INVESTMENT_TYPE.MUTUAL_FUND ? "MF" : capitalise(type)}`
									: capitalise(broker)}{" "}
								Investments
							</span>
							<InvBtn />
						</div>
						{!!resp?.count && (
							<div className="flex items-center gap-2 w-full">
								<Amount
									amount={total}
									className="text-base md:text-2xl text-primary"
									shorten
								/>
								<span className="text-xs md:text-sm">
									{overall > 0
										? `${((total / overall) * 100).toFixed(1)}%`
										: "0%"}{" "}
									of total investments
								</span>
							</div>
						)}
					</div>
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
										{!!resp?.count && brokerOptions.length > 0 && (
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
										{!!resp?.count && categoryOptions.length > 0 && (
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
						{resp?.count === 0 && (
							<div className="mx-auto text-lg font-bold">
								You have not added any investments yet
							</div>
						)}
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
