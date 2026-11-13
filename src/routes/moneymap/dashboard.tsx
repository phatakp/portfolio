import { useUser } from "@clerk/tanstack-react-start";
import { createFileRoute } from "@tanstack/react-router";
import { ExpenseChart } from "@/components/features/dashboard/expense-chart";
import { NetWorthCard } from "@/components/features/dashboard/networth-card";
import { Spinner } from "@/components/ui/spinner";

export const Route = createFileRoute("/moneymap/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	const { user, isLoaded } = useUser();

	if (!isLoaded) return <Spinner />;
	if (!user) return <div>You are not signed in!</div>;

	return (
		<div className="py-8 px-4 md:px-0 flex flex-col gap-8 container">
			<h1 className="title">Dashboard</h1>
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
