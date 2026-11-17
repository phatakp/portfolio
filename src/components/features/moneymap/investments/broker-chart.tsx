import { Pie, PieChart, type PieSectorShapeProps, Sector } from "recharts";
import {
	useGetInvestments,
	useGetUserInvestments,
} from "@/api/moneymap/acct.getters";
import { Card, CardContent } from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { capitalise } from "@/lib/utils";
import { Route } from "@/routes/moneymap/investments";
import { useAppStore } from "@/stores/app.store";

export function BrokerChart() {
	const user = useAppStore((state) => state.user);
	const { auth } = Route.useRouteContext();
	const userId = user?.id ?? auth.userId;

	const { data: resp } = useGetInvestments();
	const { data: investments } = useGetUserInvestments(
		resp?.records ?? [],
		userId as string,
	);
	if (investments.length === 0) return null;

	const grouped = Object.groupBy(investments, (item) => item.record.broker);

	const data = Object.entries(grouped)
		.map(([broker, items]) => ({
			broker,
			total:
				items
					?.filter((i) => Number.isFinite(i.record.investedAmt))
					.reduce((sum, item) => sum + item.record.investedAmt, 0) ?? 0,
		}))
		.sort((a, b) => b.total - a.total);
	const total = data.reduce((acc, b) => acc + b.total, 0);

	const chartConfig = data.reduce(
		(acc, d, i) => {
			acc[d.broker] = {
				label: capitalise(d.broker),
				color:
					i <= 8
						? `var(--color-pink-${i * 100 + 100})`
						: `var(--color-orange-${(i - 8) * 100 + 100})`,
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
		<Card className="feature-card">
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
				<div className="flex gap-4 flex-wrap items-center justify-center">
					{data.map((d, i) => (
						<div
							key={d.broker}
							className={`flex flex-col items-end p-2 rounded-sm shadow ${i <= 8 ? `shadow-pink-${i * 100 + 100}` : `shadow-orange-${(i - 8) * 100 + 100}`}`}
						>
							<span
								className={`text-xs ${i <= 8 ? `text-pink-${i * 100 + 100}` : `text-orange-${(i - 8) * 100 + 100}`}`}
							>
								{capitalise(d.broker)}
							</span>
							{/* <Amount amount={d.total} className="text-sm" shorten /> */}
							<span className="text-sm">
								{((d.total / total) * 100).toFixed(1)}%
							</span>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
