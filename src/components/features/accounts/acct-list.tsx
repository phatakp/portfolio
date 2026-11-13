import { useSuspenseQuery } from "@tanstack/react-query";
import { apiQueries } from "@/api/moneymap/queries";
import { Amount } from "@/components/shared/amount";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { capitalise } from "@/lib/utils";
import { Route } from "@/routes/moneymap/accounts";
import { AcctListItem } from "./acct-list-item";

export function AcctList() {
	const { auth } = Route.useRouteContext();
	const { data: resp } = useSuspenseQuery(
		apiQueries.account.userAccts(auth.userId as string),
	);

	const acctByType = Object.groupBy(
		resp?.records ?? [],
		({ record }) => record.acctType,
	);

	return (
		<div className="flex flex-col gap-6">
			{Object.entries(acctByType).map(([key, values]) => {
				const total =
					values?.reduce((acc, b) => acc + b.record.currValue, 0) ?? 0;
				return (
					<Card className="p-0" key={key}>
						<CardHeader className="gradient py-4 rounded-t-md">
							<CardTitle>{capitalise(key)}</CardTitle>
							<CardAction>
								<Amount amount={total} className="text-base" />
							</CardAction>
						</CardHeader>
						<CardContent>
							<div className="flex flex-col gap-2 pb-4">
								{values?.map(({ record: acct, rowNumber }) => (
									<AcctListItem
										key={rowNumber}
										acctId={rowNumber}
										acct={acct}
									/>
								))}
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
