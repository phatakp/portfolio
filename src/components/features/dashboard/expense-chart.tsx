import { Pie, PieChart } from "recharts";
import { Amount } from "@/components/shared/amount";
import { Card, CardContent } from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { capitalise } from "@/lib/utils";

const data = [
	{ category: "food", total: 43570 },
	{ category: "utilities", total: 7390 },
	{ category: "health", total: 14890 },
	{ category: "travel", total: 20390 },
	{ category: "pleasure", total: 10000 },
];

export function ExpenseChart() {
	const chartConfig = data.reduce(
		(acc, d, i) => {
			acc[d.category] = {
				label: capitalise(d.category),
				color: `var(--chart-${i + 1})`,
			};
			return acc;
		},
		{} as Record<string, Record<string, string>>,
	) satisfies ChartConfig;

	const chartData = data.map((item) => ({
		...item,
		fill:
			chartConfig[item.category as keyof typeof chartConfig]?.color ||
			"var(--chart-1)",
	}));

	return (
		<Card className="flex flex-col">
			<CardContent className="flex flex-col pb-0 gap-4">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
					<span className="title text-base">Major Expenses</span>
					<Select defaultValue="1">
						<SelectTrigger className="w-fit text-xs">
							<SelectValue placeholder=" " />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="1">This Month</SelectItem>
								<SelectItem value="2">Last 3 Months</SelectItem>
								<SelectItem value="3">Last 6 Months</SelectItem>
								<SelectItem value="4">Last Year</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
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
								nameKey="category"
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
							key={d.category}
							className={`flex flex-col justify-center items-center p-2 rounded-sm shadow shadow-chart-${i + 1}`}
						>
							<span className={`text-xs text-chart-${i + 1}`}>
								{capitalise(d.category)}
							</span>
							<Amount amount={d.total} className="text-sm" />
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
