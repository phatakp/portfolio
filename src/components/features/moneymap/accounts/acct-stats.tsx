import {
	useGetAccounts,
	useGetUserAccounts,
} from "@/api/moneymap/acct.getters";
import { Stat } from "@/components/shared/stat";
import { Card, CardContent } from "@/components/ui/card";
import { CLASSIFICATION } from "@/lib/constants";
import { Route } from "@/routes/__root";
import { useAppStore } from "@/stores/app.store";

export function AcctStats() {
	const { auth } = Route.useRouteContext();
	const user = useAppStore((state) => state.user);
	const userId = user?.id ?? auth.userId;

	const { data } = useGetAccounts();
	const { data: accts } = useGetUserAccounts(
		data?.records ?? [],
		userId as string,
	);
	const totalAsset =
		accts
			.filter(
				(record) =>
					Number.isFinite(record.record.currValue) &&
					record.record.classification === CLASSIFICATION.ASSET,
			)
			.reduce((acc, record) => acc + record.record.currValue, 0) ?? 0;
	const totalLiability =
		accts
			.filter(
				(record) =>
					Number.isFinite(record.record.currValue) &&
					record.record.classification === CLASSIFICATION.LIABILITY,
			)
			.reduce((acc, record) => acc + record.record.currValue, 0) ?? 0;

	return (
		<Card className="gradient w-full md:w-fit">
			<CardContent>
				<div className="flex items-center justify-between gap-4 md:gap-16">
					<Stat title="Liquid" total={totalAsset ?? 0} />
					<Separator />
					<Stat
						title="Liabilities"
						total={totalLiability ?? 0}
						titleClass="text-right"
						className="justify-end"
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
