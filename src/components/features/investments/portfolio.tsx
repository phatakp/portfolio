import { useSuspenseQuery } from "@tanstack/react-query";
import { useGetStats } from "@/api/moneymap/acct.getters";
import { apiQueries } from "@/api/moneymap/queries";
import { Card, CardContent } from "@/components/ui/card";
import { Route } from "@/routes/moneymap/investments";
import { Stat } from "./stat";

export function Portfolio() {
	const { auth } = Route.useRouteContext();
	const { data: resp } = useSuspenseQuery(
		apiQueries.investment.userInvestments(auth.userId as string),
	);
	const { data: totalStats } = useGetStats(resp?.records || [], "all");
	const { data: stockStats } = useGetStats(resp?.records || [], "stocks");
	const { data: fundStats } = useGetStats(resp?.records || [], "funds");
	return (
		<Card className="gradient">
			<CardContent>
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
