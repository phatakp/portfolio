import { useSuspenseQuery } from "@tanstack/react-query";
import { apiQueries } from "@/api/osian/queries";
import { Amount } from "@/components/shared/amount";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export function PaymentTypeStats() {
	const { data } = useSuspenseQuery(apiQueries.payments.all());
	const grouped = Object.groupBy(data?.records ?? [], (rec) => rec.record.type);
	const stats = Object.entries(grouped)
		.map(([key, items]) => ({
			head: key,
			total: items?.reduce((acc, b) => acc + b.record.amount, 0) ?? 0,
		}))
		.sort((a, b) => (a.head > b.head ? 1 : -1));
	const total = stats.reduce((acc, b) => acc + b.total, 0);
	const totalBank = stats
		.filter((s) => s.head.includes("Bank"))
		.reduce((acc, b) => acc + b.total, 0);
	const totalBuilder = stats
		.filter((s) => s.head.includes("Demand") || s.head === "TDS")
		.reduce((acc, b) => acc + b.total, 0);

	const stamp = stats.find((s) => s.head.includes("Stamp"));

	return (
		<Card className="feature-card p-0">
			<CardHeader className="dark-gradient pt-4">
				<CardTitle className="title text-xl">Payments Summary</CardTitle>
				{/* <CardDescription>
					<Amount amount={total} className="title text-xl" />
				</CardDescription> */}
			</CardHeader>
			<CardContent className="pb-4">
				<Table>
					<TableHeader>
						<TableRow className="bg-secondary text-secondary-foreground">
							<TableHead>Head</TableHead>
							<TableHead className="text-right">Amount</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{stats.map((d, i) => {
							if (d.head.includes("Stamp")) return null;
							return (
								<>
									<TableRow key={d.head}>
										<TableCell>{d.head}</TableCell>
										<TableCell className="text-right">
											<Amount amount={d.total} className="text-sm" />
										</TableCell>
									</TableRow>
									{i === 1 && (
										<TableRow className="bg-muted text-muted-foreground">
											<TableCell>To Bank</TableCell>
											<TableCell className="text-right">
												<Amount
													amount={totalBank}
													className="text-sm text-muted-foreground"
												/>
											</TableCell>
										</TableRow>
									)}
									{i === 5 && (
										<TableRow className="bg-muted text-muted-foreground">
											<TableCell>To Builder</TableCell>
											<TableCell className="text-right">
												<Amount
													amount={totalBuilder}
													className="text-sm text-muted-foreground"
												/>
											</TableCell>
										</TableRow>
									)}
								</>
							);
						})}
						<TableRow>
							<TableCell>{stamp?.head}</TableCell>
							<TableCell className="text-right">
								<Amount amount={stamp?.total ?? 0} className="text-sm" />
							</TableCell>
						</TableRow>
					</TableBody>
					<TableFooter>
						<TableRow>
							<TableCell className="text-base">Total Cost</TableCell>
							<TableCell className="text-right">
								<Amount amount={total} className="text-xl" />
							</TableCell>
						</TableRow>
					</TableFooter>
				</Table>
			</CardContent>
		</Card>
	);
}
