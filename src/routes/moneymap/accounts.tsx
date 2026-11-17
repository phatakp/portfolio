import { useUser } from "@clerk/tanstack-react-start";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { apiQueries } from "@/api/moneymap/queries";
import { UserSelect } from "@/components/features/auth/user/user-select";
import { AcctBtn } from "@/components/features/moneymap/accounts/acct-btn";
import { AcctChart } from "@/components/features/moneymap/accounts/acct-chart";
import { AcctForm } from "@/components/features/moneymap/accounts/acct-form";
import { AcctList } from "@/components/features/moneymap/accounts/acct-list";
import { AcctStats } from "@/components/features/moneymap/accounts/acct-stats";
import { BankChart } from "@/components/features/moneymap/accounts/bank-chart";
import { SuspenseErrorBoundary } from "@/components/shared/suspense-error-boundary";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

export const Route = createFileRoute("/moneymap/accounts")({
	component: RouteComponent,
	loader: ({ context }) => {
		if (!context.auth.userId) return notFound();
		context.queryClient.query(apiQueries.account.all());
	},
	head: () => ({
		meta: [{ title: "MoneyMap | Accounts" }],
	}),
});

function RouteComponent() {
	const { user, isLoaded } = useUser();

	if (!isLoaded) return <Spinner />;
	if (!user) return <div>You are not signed in!</div>;

	return (
		<div className="py-8 px-4 md:px-0 flex flex-col gap-8 container">
			<div className="flex items-center justify-between flex-wrap gap-4">
				<h1 className="title">Accounts</h1>
				<div className="md:hidden">
					<AcctBtn />
				</div>
				<UserSelect />
			</div>

			<SuspenseErrorBoundary
				id={"acct-stats"}
				fallback={<Skeleton className="w-80 h-40 m-auto" />}
			>
				<AcctStats />
			</SuspenseErrorBoundary>

			<div className="grid md:grid-cols-12 gap-4">
				<div className="md:col-span-12 md:order-4">
					<SuspenseErrorBoundary
						id={"acct-list"}
						fallback={<Skeleton className="w-80 h-40 m-auto" />}
					>
						<AcctList />
					</SuspenseErrorBoundary>
				</div>
				<div className="md:col-span-4 md:order-2">
					<SuspenseErrorBoundary
						id={"acct-chart"}
						fallback={<Skeleton className="w-80 h-40 m-auto" />}
					>
						<AcctChart />
					</SuspenseErrorBoundary>
				</div>

				<div className="md:col-span-4 md:order-1">
					<SuspenseErrorBoundary
						id={"acct-form"}
						fallback={<Skeleton className="w-80 h-40 m-auto" />}
					>
						<Card className="hidden md:flex feature-card">
							<CardHeader>
								<CardTitle className="title">Add New Account</CardTitle>
								<CardDescription>
									Enter details for your account
								</CardDescription>
							</CardHeader>
							<CardContent className="py-8">
								<AcctForm isModal={false} />
							</CardContent>
						</Card>
					</SuspenseErrorBoundary>
				</div>

				<div className="md:col-span-4 md:order-3">
					<SuspenseErrorBoundary
						id={"bank-chart"}
						fallback={<Skeleton className="w-80 h-40 m-auto" />}
					>
						<BankChart />
					</SuspenseErrorBoundary>
				</div>
			</div>
		</div>
	);
}
