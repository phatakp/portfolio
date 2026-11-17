import { Pie, PieChart, type PieSectorShapeProps, Sector } from "recharts";
import {
	useGetAccounts,
	useGetUserAccounts,
} from "@/api/moneymap/acct.getters";
import { Amount } from "@/components/shared/amount";
import { Card, CardContent } from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { capitalise } from "@/lib/utils";
import { Route } from "@/routes/moneymap/accounts";
import { useAppStore } from "@/stores/app.store";

export function AcctChart() {
	const { auth } = Route.useRouteContext();
	const user = useAppStore((state) => state.user);
	const userId = user?.id ?? auth.userId;

	const { data: resp } = useGetAccounts();
	const { data: accts } = useGetUserAccounts(
		resp?.records ?? [],
		userId as string,
	);
	const acctByType = Object.groupBy(accts, ({ record }) => record.acctType);
	const data = Object.entries(acctByType)
		.map(([key, values]) => ({
			category: key,
			total: values?.reduce((acc, b) => acc + b.record.currValue, 0) ?? 0,
		}))
		.sort((a, b) => b.total - a.total);

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
					<span className="title text-base">Balance Summary</span>
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
								paddingAngle={2}
								shape={({
									index,
									outerRadius = 0,
									...props
								}: PieSectorShapeProps) =>
									index === 0 ? (
										<Sector {...props} outerRadius={outerRadius + 10} />
									) : (
										<Sector {...props} outerRadius={outerRadius} />
									)
								}
							/>
						</PieChart>
					</ChartContainer>
				</div>
				<div className="flex flex-col md:flex-row md:gap-4 md:items-center md:justify-center md:flex-wrap">
					{data.map((d, i) => (
						<div
							key={d.category}
							className={`flex flex-row justify-between md:flex-col md:justify-center items-center py-1 md:p-2 rounded-sm shadow shadow-chart-${i + 1}`}
						>
							<span className={`text-xs text-chart-${i + 1}`}>
								{capitalise(d.category)}
							</span>
							<Amount amount={d.total} className="text-sm" shorten />
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
