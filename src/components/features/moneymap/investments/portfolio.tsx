import {
	useGetInvestments,
	useGetStats,
	useGetUserInvestments,
} from "@/api/moneymap/acct.getters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Route } from "@/routes/moneymap/investments";
import { useAppStore } from "@/stores/app.store";
import { Stat } from "./stat";

export function Portfolio() {
	const user = useAppStore((state) => state.user);
	const { auth } = Route.useRouteContext();
	const { data: resp } = useGetInvestments();
	const userId = user?.id ?? auth.userId;
	const { data: investments } = useGetUserInvestments(
		resp?.records ?? [],
		userId as string,
	);
	const { data: totalStats } = useGetStats(investments || [], "all");
	const { data: stockStats } = useGetStats(investments || [], "stocks");
	const { data: fundStats } = useGetStats(investments || [], "funds");
	if (investments?.length === 0) return null;

	return (
		<Card className="gradient p-0">
			<CardHeader className="pt-4">
				<CardTitle>
					{user && user.id === "all"
						? "Combined Family"
						: user
							? user.name
							: `${auth.firstName} ${auth.lastName}`}
				</CardTitle>
			</CardHeader>
			<CardContent className="py-0">
				<div className="flex items-center justify-between gap-4 md:gap-16">
					<Stat
						title="Portfolio"
						currValue={totalStats?.value ?? 0}
						gains={totalStats?.gains ?? 0}
					/>
					<Separator />
					<Stat
						title="Stocks"
						currValue={stockStats?.value ?? 0}
						gains={stockStats?.gains ?? 0}
					/>
					<Separator />
					<Stat
						title="Funds/Deposits"
						currValue={fundStats?.value ?? 0}
						gains={fundStats?.gains ?? 0}
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
