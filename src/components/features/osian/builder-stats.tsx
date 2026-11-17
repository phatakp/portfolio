import { useSuspenseQuery } from "@tanstack/react-query";
import { apiQueries } from "@/api/osian/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PAYMENT_SOURCE, PAYMENT_TYPE } from "@/lib/constants";
import { Stat } from "../../shared/stat";

export function BuilderStats() {
	const { data } = useSuspenseQuery(apiQueries.payments.all());
	const totalBank =
		data?.records
			.filter(
				(record) =>
					![
						PAYMENT_TYPE.BANKEMI,
						PAYMENT_TYPE.BANKPRIN,
						PAYMENT_TYPE.STAMPDUTY,
					].includes(record.record.type) &&
					Number.isFinite(record.record.amount) &&
					record.record.source === PAYMENT_SOURCE.BANK,
			)
			.reduce((acc, record) => acc + record.record.amount, 0) ?? 0;
	const totalSelf =
		data?.records
			.filter(
				(record) =>
					![
						PAYMENT_TYPE.BANKEMI,
						PAYMENT_TYPE.BANKPRIN,
						PAYMENT_TYPE.STAMPDUTY,
					].includes(record.record.type) &&
					Number.isFinite(record.record.amount) &&
					record.record.source === PAYMENT_SOURCE.SELF,
			)
			.reduce((acc, record) => acc + record.record.amount, 0) ?? 0;

	return (
		<Card className="gradient">
			<CardHeader>
				<CardTitle>Builder Payment Stats</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex items-center justify-between gap-4 md:gap-16">
					<Stat title="From Self" total={totalSelf} />
					<Separator />
					<Stat
						title="From Bank"
						total={totalBank}
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
