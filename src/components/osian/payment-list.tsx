import { useSelector } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { usePayments } from "@/api/osian/osian.getters";
import { apiQueries } from "@/api/osian/queries";
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
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	PAYMENT_SOURCE_OPTIONS,
	PAYMENT_TYPE,
	PAYMENT_TYPE_OPTIONS,
} from "@/lib/constants";
import { capitalise } from "@/lib/utils";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { PaymentBtn } from "./payment-btn";
import { PaymentListItem } from "./payment-list-item";

export function PaymentList() {
	const [activePage, setActivePage] = useState(1);

	const { data: resp } = usePayments();

	const form = useAppForm({
		defaultValues: {
			source: "all",
			type: "all",
		},
		onSubmit: async () => {},
	});
	const source = useSelector(form.store, (state) => state.values.source);
	const type = useSelector(form.store, (state) => state.values.type);

	useEffect(() => {
		if (!source) form.setFieldValue("source", "all");
		if (!type) form.setFieldValue("type", "all");
	}, [source, type, form.setFieldValue]);

	const { data: payments } = useSuspenseQuery(
		apiQueries.payments.filtered(resp?.records ?? [], type, source),
	);

	const total =
		payments
			?.filter((record) => Number.isFinite(record.record.amount))
			.reduce((acc, b) => acc + b.record.amount, 0) ?? 0;
	const page = payments?.slice(
		(activePage - 1) * 10,
		(activePage - 1) * 10 + 10,
	);

	const typeOptions = PAYMENT_TYPE_OPTIONS.map((t) => ({
		label: capitalise(t),
		value: t,
	})).concat({ label: "All", value: "all" });
	const sourceOptions = PAYMENT_SOURCE_OPTIONS.map((t) => ({
		label: capitalise(t),
		value: t,
	})).concat({ label: "All", value: "all" });

	return (
		<div className="flex flex-col gap-6">
			<Card className="p-0 w-[calc(100vw-2rem)] md:w-full">
				<CardHeader className="gradient py-4 rounded-t-md">
					<CardTitle className="text-base md:text-xl tracking-wide capitalize text-muted-foreground">
						Payments Made
					</CardTitle>
					<CardDescription>
						<div className="flex items-center gap-2">
							<Amount
								amount={total}
								className="text-base md:text-2xl text-primary"
								shorten
							/>
							<span>
								in {payments?.length ?? 0} {source === "all" ? "" : source}{" "}
								payments
							</span>
						</div>
					</CardDescription>
					<CardAction>
						<PaymentBtn />
					</CardAction>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-6 pb-2">
						<form
							className="flex flex-col gap-4"
							onSubmit={(e) => {
								e.preventDefault();
								form.handleSubmit();
							}}
						>
							<form.AppForm>
								<div className="flex flex-col gap-6 md:flex-row md:justify-between md:gap-4">
									<form.AppField
										name="type"
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
													value={type}
													onChange={(e) => {
														field.setValue(e.target.value);
													}}
													label={"Payment Type"}
													options={typeOptions}
												/>
											);
										}}
									</form.AppField>

									{![
										PAYMENT_TYPE.BANKEMI,
										PAYMENT_TYPE.BANKPRIN,
										PAYMENT_TYPE.TDS,
										PAYMENT_TYPE.STAMPDUTY,
									].includes(type) && (
										<form.AppField
											name="source"
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
													<ButtonGroup>
														{sourceOptions.map((s) => (
															<Button
																key={s.value}
																variant={
																	s.value === field.state.value
																		? "default"
																		: "outline"
																}
																onClick={() => field.setValue(s.value)}
															>
																{s.label}
															</Button>
														))}
													</ButtonGroup>
												);
											}}
										</form.AppField>
									)}
								</div>
							</form.AppForm>
						</form>

						<Table>
							<TableHeader className="bg-secondary text-secondary-foreground">
								<TableRow>
									<TableHead className="title text-sm w-30 md:w-full">
										Description
									</TableHead>
									<TableHead className="title text-sm hidden md:table-cell">
										Date
									</TableHead>
									<TableHead className="title text-sm text-right">
										Amount
									</TableHead>
									<TableHead></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{page?.map(({ rowNumber, record }) => (
									<PaymentListItem
										key={rowNumber}
										id={rowNumber}
										payment={record}
									></PaymentListItem>
								))}
							</TableBody>
						</Table>
					</div>
				</CardContent>
				<CardFooter>
					<div className="flex justify-center items-center w-full pb-4">
						<PaginationRibbon
							count={payments?.length ?? 0}
							activePage={activePage}
							setActivePage={setActivePage}
							pageSize={10}
						/>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
