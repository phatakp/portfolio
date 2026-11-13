import { TrendingDown, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "An area chart with icons";

const chartData = [
	{ month: "January", income: 186, expenses: 80 },
	{ month: "February", income: 305, expenses: 200 },
	{ month: "March", income: 237, expenses: 120 },
	{ month: "April", income: 73, expenses: 190 },
	{ month: "May", income: 209, expenses: 130 },
	{ month: "June", income: 214, expenses: 140 },
];

const chartConfig = {
	income: {
		label: "Income",
		color: "var(--chart-3)",
		icon: TrendingUp,
	},
	expenses: {
		label: "Expenses",
		color: "var(--chart-4)",
		icon: TrendingDown,
	},
} satisfies ChartConfig;

export function AreaChartWithIcons() {
	return (
		<Card className="feature-card">
			<CardHeader>
				<CardTitle>Finance Tracking</CardTitle>
				<CardDescription>Showing monthly income / expenses</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="max-h-88 w-full">
					<AreaChart
						accessibilityLayer
						data={chartData}
						margin={{
							left: 12,
							right: 12,
						}}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="month"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tickFormatter={(value) => value.slice(0, 3)}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator="line" />}
						/>
						<Area
							dataKey="expenses"
							type="natural"
							fill="var(--color-expenses)"
							fillOpacity={0.4}
							stroke="var(--color-expenses)"
							stackId="a"
						/>
						<Area
							dataKey="income"
							type="natural"
							fill="var(--color-income)"
							fillOpacity={0.4}
							stroke="var(--color-income)"
							stackId="a"
						/>
						<ChartLegend content={<ChartLegendContent />} />
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
