import { Amount } from "@/components/shared/amount";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export function ProjectCost() {
	const data = [
		{ head: "Agreement Cost", amount: 11892935 },
		{ head: "Agreement GST", amount: 594647 },
		{ head: "Stamp Duty", amount: 832700 },
		{ head: "Registration", amount: 30000 },
	];
	const total = data.reduce((acc, b) => acc + b.amount, 0);
	const builderTotal = data
		.filter((d) => d.head.includes("Agreement"))
		.reduce((acc, b) => acc + b.amount, 0);

	return (
		<Card className="feature-card p-0">
			<CardHeader className="dark-gradient pt-4">
				<CardTitle className="text-sm text-muted-foreground">
					Osian Almanova
				</CardTitle>
				<CardDescription className="title text-xl">A-1506 Cost</CardDescription>
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
						{data.map((d, i) => (
							<>
								<TableRow key={d.head}>
									<TableCell>{d.head}</TableCell>
									<TableCell className="text-right">
										<Amount amount={d.amount} className="text-sm" />
									</TableCell>
								</TableRow>
								{i === 1 && (
									<TableRow className="bg-muted text-muted-foreground">
										<TableCell>To Builder</TableCell>
										<TableCell className="text-right">
											<Amount
												amount={builderTotal}
												className="text-sm text-muted-foreground"
											/>
										</TableCell>
									</TableRow>
								)}
							</>
						))}
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
