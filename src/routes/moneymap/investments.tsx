import { useUser } from "@clerk/tanstack-react-start";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { apiQueries } from "@/api/moneymap/queries";
import { UserSelect } from "@/components/features/auth/user/user-select";
import { BrokerChart } from "@/components/features/moneymap/investments/broker-chart";
import { CategoryChart } from "@/components/features/moneymap/investments/category-chart";
import { InvTabs } from "@/components/features/moneymap/investments/inv-tabs";
import { Portfolio } from "@/components/features/moneymap/investments/portfolio";
import { SuspenseErrorBoundary } from "@/components/shared/suspense-error-boundary";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

export const Route = createFileRoute("/moneymap/investments")({
	component: RouteComponent,
	loader: ({ context }) => {
		if (!context.auth.userId) return notFound();
		context.queryClient.query(apiQueries.investment.all());
	},
	head: () => ({
		meta: [{ title: "MoneyMap | Investments" }],
	}),
});

function RouteComponent() {
	const { user, isLoaded } = useUser();

	if (!isLoaded) return <Spinner />;
	if (!user) return <div>You are not signed in!</div>;

	return (
		<div className="py-8 px-4 md:px-0 flex flex-col gap-8 container">
			<div className="flex md:items-center gap-4 flex-col md:flex-row md:justify-between">
				<div className="grid gap-2">
					<h1 className="title">Investments</h1>
					<span className="text-sm text-muted-foreground">
						Track how your investments are performing
					</span>
				</div>
				<UserSelect />
			</div>

			<div className="w-fit">
				<SuspenseErrorBoundary
					id={"inv-portfolio"}
					fallback={<Skeleton className="w-80 h-40 m-auto" />}
				>
					<Portfolio />
				</SuspenseErrorBoundary>
			</div>

			<div className="grid md:grid-cols-12 gap-4">
				<div className="md:col-span-4 md:row-span-2">
					<SuspenseErrorBoundary
						id={"inv-list"}
						fallback={<Skeleton className="w-80 h-40 m-auto" />}
					>
						<InvTabs />
					</SuspenseErrorBoundary>
				</div>
				<div className="md:col-span-8 gap-4 grid md:grid-cols-2">
					<SuspenseErrorBoundary
						id={"broker-chart"}
						fallback={<Skeleton className="w-80 h-40 m-auto" />}
					>
						<BrokerChart />
					</SuspenseErrorBoundary>

					<SuspenseErrorBoundary
						id={"category-chart"}
						fallback={<Skeleton className="w-80 h-40 m-auto" />}
					>
						<CategoryChart />
					</SuspenseErrorBoundary>
				</div>
			</div>
		</div>
	);
}
