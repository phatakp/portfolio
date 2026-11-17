import { useUser } from "@clerk/tanstack-react-start";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { apiQueries } from "@/api/moneymap/queries";
import { UserSelect } from "@/components/features/auth/user/user-select";
import { ExpenseChart } from "@/components/features/moneymap/dashboard/expense-chart";
import { NetWorthCard } from "@/components/features/moneymap/dashboard/networth-card";
import { Spinner } from "@/components/ui/spinner";

export const Route = createFileRoute("/moneymap/dashboard")({
	component: RouteComponent,
	loader: ({ context }) => {
		if (!context.auth.userId) return notFound();
		context.queryClient.query(apiQueries.account.all());
		context.queryClient.query(apiQueries.investment.all());
	},
	head: () => ({
		meta: [{ title: "MoneyMap | Dashboard" }],
	}),
});

function RouteComponent() {
	const { user, isLoaded } = useUser();

	if (!isLoaded) return <Spinner />;
	if (!user) return <div>You are not signed in!</div>;

	return (
		<div className="py-8 px-4 md:px-0 flex flex-col gap-8 container">
			<div className="flex items-center justify-between flex-wrap gap-4">
				<h1 className="title">Dashboard</h1>
				<UserSelect />
			</div>
			<div className="grid md:grid-cols-12 gap-4">
				<div className="md:col-span-8">
					<NetWorthCard />
				</div>
				<div className="md:col-span-4">
					<ExpenseChart />
				</div>
			</div>
		</div>
	);
}
