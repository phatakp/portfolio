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

// const colors = [
// 	"text-orange-100",
// 	"text-orange-200",
// 	"text-orange-300",
// 	"text-orange-400",
// 	"text-orange-500",
// 	"text-orange-600",
// 	"text-orange-700",
// 	"text-orange-800",
// 	"text-orange-900",
// 	"bg-orange-100",
// 	"bg-orange-200",
// 	"bg-orange-300",
// 	"bg-orange-400",
// 	"bg-orange-500",
// 	"bg-orange-600",
// 	"bg-orange-700",
// 	"bg-orange-800",
// 	"bg-orange-900",
// 	"text-pink-100",
// 	"text-pink-200",
// 	"text-pink-300",
// 	"text-pink-400",
// 	"text-pink-500",
// 	"text-pink-600",
// 	"text-pink-700",
// 	"text-pink-800",
// 	"text-pink-900",
// 	"bg-pink-100",
// 	"bg-pink-200",
// 	"bg-pink-300",
// 	"bg-pink-400",
// 	"bg-pink-500",
// 	"bg-pink-600",
// 	"bg-pink-700",
// 	"bg-pink-800",
// 	"bg-pink-900",
// ];

export function CategoryChart() {
	const user = useAppStore((state) => state.user);
	const { auth } = Route.useRouteContext();
	const { data: resp } = useGetInvestments();
	const userId = user?.id ?? auth.userId;
	const { data: investments } = useGetUserInvestments(
		resp?.records ?? [],
		userId as string,
	);

	if (investments?.length === 0) return null;

	const grouped = Object.groupBy(
		investments ?? [],
		(item) => item.record.category,
	);

	const data = Object.entries(grouped)
		.map(([category, items]) => ({
			category,
			total:
				items
					?.filter((i) => Number.isFinite(i.record.investedAmt))
					.reduce((sum, item) => sum + item.record.investedAmt, 0) ?? 0,
		}))
		.sort((a, b) => b.total - a.total);

	const total = data.reduce((acc, b) => acc + b.total, 0);

	const chartConfig = data.reduce(
		(acc, d, i) => {
			acc[d.category] = {
				label: capitalise(d.category),
				color:
					i <= 8
						? `var(--color-orange-${i * 100 + 100})`
						: `var(--color-pink-${(i - 8) * 100 + 100})`,
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
		<Card className="feature-card">
			<CardContent className="flex flex-col pb-0 gap-4">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
					<span className="title text-base">Investments by Category</span>
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
				<div className="flex gap-4 flex-wrap items-center justify-center">
					{data.map((d, i) => (
						<div
							key={d.category}
							className={`flex flex-col items-end p-2 rounded-sm shadow ${i <= 8 ? `shadow-orange-${i * 100 + 100}` : `shadow-pink-${(i - 8) * 100 + 100}`}`}
						>
							<span
								className={`text-xs ${i <= 8 ? `text-orange-${i * 100 + 100}` : `text-pink-${(i - 8) * 100 + 100}`}`}
							>
								{capitalise(d.category)}
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
