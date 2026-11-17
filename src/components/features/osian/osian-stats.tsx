import { useSuspenseQuery } from "@tanstack/react-query";
import { apiQueries } from "@/api/osian/queries";
import { Stat } from "@/components/shared/stat";
import { Card, CardContent } from "@/components/ui/card";
import { PAYMENT_TYPE } from "@/lib/constants";

export function OsianStats() {
	const { data } = useSuspenseQuery(apiQueries.payments.all());
	const total =
		data?.records
			.filter((record) => Number.isFinite(record.record.amount))
			.reduce((acc, record) => acc + record.record.amount, 0) ?? 0;

	const totalBank =
		data?.records
			.filter(
				(record) =>
					[PAYMENT_TYPE.BANKEMI, PAYMENT_TYPE.BANKPRIN].includes(
						record.record.type,
					) && Number.isFinite(record.record.amount),
			)
			.reduce((acc, record) => acc + record.record.amount, 0) ?? 0;
	const totalBuilder =
		data?.records
			.filter(
				(record) =>
					[
						PAYMENT_TYPE.DEMANDGST,
						PAYMENT_TYPE.DEMANDPRIN,
						PAYMENT_TYPE.TDS,
					].includes(record.record.type) &&
					Number.isFinite(record.record.amount),
			)
			.reduce((acc, record) => acc + record.record.amount, 0) ?? 0;

	return (
		<Card className="gradient">
			<CardContent>
				<div className="flex items-center justify-between gap-4 md:gap-16">
					<Stat
						title="Builder Paid"
						total={totalBuilder ?? 0}
						titleClass="text-right"
					/>
					<Separator />
					<Stat
						title="Bank Paid"
						total={totalBank ?? 0}
						titleClass="text-right"
					/>
					<Separator />
					<Stat
						title="Total Paid"
						total={total ?? 0}
						className="justify-end"
						titleClass="text-right"
					/>
				</div>
			</CardContent>
		</Card>
	);
}

function Separator() {
	return (
		<div className="flex items-center justify-center gap-x-px">
			<span className="h-20 bg-accent-foreground w-px" />
			<span className="h-20 bg-accent-foreground w-px" />
			<span className="h-20 bg-accent-foreground w-px" />
			<span className="h-20 bg-accent-foreground w-px" />
		</div>
	);
}
