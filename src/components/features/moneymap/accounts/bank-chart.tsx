import {
	Bar,
	BarChart,
	type BarShapeProps,
	CartesianGrid,
	Rectangle,
} from "recharts";
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
import { CLASSIFICATION } from "@/lib/constants";
import { capitalise } from "@/lib/utils";
import { Route } from "@/routes/moneymap/accounts";
import { useAppStore } from "@/stores/app.store";

export function BankChart() {
	const { auth } = Route.useRouteContext();
	const user = useAppStore((state) => state.user);
	const userId = user?.id ?? auth.userId;

	const { data: resp } = useGetAccounts();
	const { data: accts } = useGetUserAccounts(
		resp?.records ?? [],
		userId as string,
	);
	const acctByType = Object.groupBy(accts, ({ record }) => record.bank);
	const data = Object.entries(acctByType).map(([key, values]) => ({
		category: key,
		total:
			values?.reduce(
				(acc, b) =>
					b.record.classification === CLASSIFICATION.ASSET
						? acc + b.record.currValue
						: acc - b.record.currValue,
				0,
			) ?? 0,
	}));

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
					<span className="title text-base">Net Balances per Bank</span>
				</div>
				<div className="h-full w-full relative">
					<ChartContainer
						config={chartConfig}
						className="mx-auto h-full w-full"
					>
						<BarChart accessibilityLayer data={chartData}>
							<CartesianGrid vertical={false} />
							<ChartTooltip
								cursor={false}
								content={<ChartTooltipContent hideLabel hideIndicator />}
							/>
							<Bar
								dataKey="total"
								strokeWidth={2}
								radius={8}
								shape={({ index, ...props }: BarShapeProps) =>
									index === 0 ? (
										<Rectangle
											{...props}
											fillOpacity={0.8}
											stroke={props.payload.fill}
											strokeDasharray={4}
											strokeDashoffset={4}
										/>
									) : (
										<Rectangle {...props} />
									)
								}
							/>
						</BarChart>
					</ChartContainer>
				</div>
				<div className="flex gap-4 items-center justify-center flex-wrap">
					{data.map((d, i) => (
						<div
							key={d.category}
							className={`flex flex-col justify-center items-end p-2 rounded-sm shadow shadow-chart-${i + 1}`}
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
