import { useSuspenseQuery } from "@tanstack/react-query";
import { Pie, PieChart } from "recharts";
import { apiQueries } from "@/api/moneymap/queries";
import { Amount } from "@/components/shared/amount";
import { Card, CardContent } from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

import { capitalise } from "@/lib/utils";
import { Route } from "@/routes/moneymap/investments";

export function BrokerChart() {
	const { auth } = Route.useRouteContext();
	const { data: resp } = useSuspenseQuery(
		apiQueries.investment.userInvestments(auth.userId as string),
	);

	const grouped = Object.groupBy(
		resp?.records ?? [],
		(item) => item.record.broker,
	);

	const data = Object.entries(grouped).map(([broker, items]) => ({
		broker,
		total:
			items
				?.filter((i) => Number.isFinite(i.record.investedAmt))
				.reduce((sum, item) => sum + item.record.investedAmt, 0) ?? 0,
	}));

	const chartConfig = data.reduce(
		(acc, d, i) => {
			acc[d.broker] = {
				label: capitalise(d.broker),
				color: `var(--chart-${(i % 5) + 1})`,
			};
			return acc;
		},
		{} as Record<string, Record<string, string>>,
	) satisfies ChartConfig;

	const chartData = data.map((item) => ({
		...item,
		fill:
			chartConfig[item.broker as keyof typeof chartConfig]?.color ||
			"var(--chart-1)",
	}));

	return (
		<Card className="flex flex-col">
			<CardContent className="flex flex-col pb-0 gap-4">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
					<span className="title text-base">Investments by Broker</span>
				</div>
				<div className="h-full w-full relative">
					<ChartContainer
						config={chartConfig}
						className="mx-auto h-full w-full min-h-39"
					>
						<PieChart>
							<ChartTooltip
								cursor={false}
								content={<ChartTooltipContent hideLabel />}
							/>

							<Pie
								data={chartData}
								dataKey="total"
								nameKey="broker"
								innerRadius={60}
								outerRadius={80}
								paddingAngle={2}
							/>
						</PieChart>
					</ChartContainer>
				</div>
				<div className="flex gap-4 flex-wrap items-center justify-center">
					{data.map((d, i) => (
						<div
							key={d.broker}
							className={`flex flex-col justify-center items-center p-2 rounded-sm shadow shadow-chart-${i + 1}`}
						>
							<span className={`text-xs text-chart-${i + 1}`}>
								{capitalise(d.broker)}
							</span>
							<Amount amount={d.total} className="text-sm" />
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
