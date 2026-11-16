import { useUser } from "@clerk/tanstack-react-start";
import { createFileRoute } from "@tanstack/react-router";
import { apiQueries } from "@/api/osian/queries";
import { BuilderStats } from "@/components/features/osian/builder-stats";
import { OsianStats } from "@/components/features/osian/osian-stats";
import { OsianTabs } from "@/components/features/osian/osian-tabs";
import { PaymentTypeStats } from "@/components/features/osian/payment-type-stats";
import { ProjectCost } from "@/components/features/osian/project-cost";
import { Remaining } from "@/components/features/osian/remaining";
import { SuspenseErrorBoundary } from "@/components/shared/suspense-error-boundary";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

export const Route = createFileRoute("/osian/dashboard")({
	component: RouteComponent,
	loader: ({ context }) => {
		context.queryClient.query(apiQueries.payments.all());
		context.queryClient.query(apiQueries.schedule.all());
	},
});

function RouteComponent() {
	const { user, isLoaded } = useUser();

	if (!isLoaded) return <Spinner />;
	if (!user) return <div>You are not signed in!</div>;

	return (
		<div className="py-8 px-4 md:px-0 flex flex-col gap-8 container">
			<div className="flex md:items-center gap-4 flex-col md:flex-row md:justify-between">
				<div className="grid gap-2">
					<h1 className="title">Osian Dashboard</h1>
					<SuspenseErrorBoundary
						id={"remaining"}
						fallback={<Skeleton className="w-80 h-10" />}
					>
						<Remaining />
					</SuspenseErrorBoundary>
				</div>
				<div className="w-fit">
					<SuspenseErrorBoundary
						id={"osian-stats"}
						fallback={<Skeleton className="w-80 h-40 m-auto" />}
					>
						<OsianStats />
					</SuspenseErrorBoundary>
				</div>
			</div>
			<div className="grid md:grid-cols-12 gap-6">
				<div className="md:col-span-8 order-2 md:order-1">
					<SuspenseErrorBoundary
						id={"osian"}
						fallback={<Skeleton className="w-80 h-40 m-auto" />}
					>
						<OsianTabs />
					</SuspenseErrorBoundary>
				</div>
				<div className="md:col-span-4 order-1 md:order-2 flex flex-col gap-6">
					<ProjectCost />
					<div className="w-full">
						<SuspenseErrorBoundary
							id={"builder-stats"}
							fallback={<Skeleton className="w-80 h-40 m-auto" />}
						>
							<BuilderStats />
						</SuspenseErrorBoundary>
					</div>
					<div className="w-full">
						<SuspenseErrorBoundary
							id={"payment-stats"}
							fallback={<Skeleton className="w-80 h-40 m-auto" />}
						>
							<PaymentTypeStats />
						</SuspenseErrorBoundary>
					</div>
				</div>
			</div>
		</div>
	);
}
