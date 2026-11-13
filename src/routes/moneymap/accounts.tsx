import { useUser } from "@clerk/tanstack-react-start";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { apiQueries } from "@/api/moneymap/queries";
import { AcctBtn } from "@/components/features/accounts/acct-btn";
import { AcctChart } from "@/components/features/accounts/acct-chart";
import { AcctList } from "@/components/features/accounts/acct-list";
import { SuspenseErrorBoundary } from "@/components/shared/suspense-error-boundary";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

export const Route = createFileRoute("/moneymap/accounts")({
	component: RouteComponent,
	loader: ({ context }) => {
		if (!context.auth.userId) return notFound();
		context.queryClient.query(
			apiQueries.account.userAccts(context.auth.userId),
		);
	},
});

function RouteComponent() {
	const { user, isLoaded } = useUser();

	if (!isLoaded) return <Spinner />;
	if (!user) return <div>You are not signed in!</div>;

	return (
		<div className="py-8 px-4 md:px-0 flex flex-col gap-8 container">
			<div className="flex items-center justify-between">
				<h1 className="title">Accounts</h1>
				<AcctBtn />
			</div>

			<div className="grid md:grid-cols-12 gap-4">
				<div className="md:col-span-8">
					<SuspenseErrorBoundary
						id={"acct-list"}
						fallback={<Skeleton className="w-80 h-40 m-auto" />}
					>
						<AcctList />
					</SuspenseErrorBoundary>
				</div>
				<div className="md:col-span-4">
					<SuspenseErrorBoundary
						id={"acct-chart"}
						fallback={<Skeleton className="w-80 h-40 m-auto" />}
					>
						<AcctChart />
					</SuspenseErrorBoundary>
				</div>
			</div>
		</div>
	);
}
