import { UserAvatar } from "@clerk/tanstack-react-start";
import {
	useGetAccounts,
	useGetInvestments,
	useGetUserAccounts,
	useGetUserInvestments,
} from "@/api/moneymap/acct.getters";
import { UserEmail } from "@/components/features/auth/user/user-email";
import { Amount } from "@/components/shared/amount";
import { Background } from "@/components/shared/background";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import { ACCOUNT_TYPE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Route } from "@/routes/__root";
import { useAppStore } from "@/stores/app.store";
import { AcctBtn } from "../accounts/acct-btn";

// const classes = [
// 	"bg-chart-1",
// 	"bg-chart-2",
// 	"bg-chart-3",
// 	"bg-chart-4",
// 	"bg-chart-5",
// 	"text-chart-1",
// 	"text-chart-2",
// 	"text-chart-3",
// 	"text-chart-4",
// 	"text-chart-5",
// ];

export function NetWorthCard() {
	const { auth } = Route.useRouteContext();
	const user = useAppStore((state) => state.user);
	const userId = user?.id ?? auth.userId;

	const { data: resp1 } = useGetAccounts();
	const { data: resp2 } = useGetInvestments();
	const { data: accts } = useGetUserAccounts(
		resp1?.records ?? [],
		userId as string,
	);
	const { data: investments } = useGetUserInvestments(
		resp2?.records ?? [],
		userId as string,
	);
	const isCash = accts?.find((a) => a.record.bank.toLowerCase() === "cash");

	const acctGroup = Object.groupBy(accts ?? [], (rec) => rec.record.acctType);
	const invGroup = Object.groupBy(
		investments ?? [],
		(rec) => rec.record.invType,
	);

	const data = Object.entries(acctGroup)
		.map(([key, items], i) => ({
			type: key,
			balance: items?.reduce((acc, b) => acc + b.record.currValue, 0) ?? 0,
			isAsset: ![ACCOUNT_TYPE.CREDIT_CARD, ACCOUNT_TYPE.MORTGAGE].includes(key),
			color: [ACCOUNT_TYPE.CREDIT_CARD, ACCOUNT_TYPE.MORTGAGE].includes(key)
				? "destructive"
				: `chart-${(i % 5) + 1}`,
		}))
		.concat(
			Object.entries(invGroup).map(([key, items], i) => ({
				type: key,
				balance:
					items
						?.filter((r) => Number.isFinite(r.record.currValue))
						.reduce((acc, b) => acc + b.record.currValue, 0) ?? 0,
				isAsset: true,
				color: `chart-${((Object.entries(acctGroup).length + i) % 5) + 1}`,
			})),
		)
		.sort((a, b) => b.balance - a.balance);

	const assets = data
		.filter((d) => d.isAsset)
		.reduce((acc, d) => acc + d.balance, 0);
	const liabilities = data
		.filter((d) => !d.isAsset)
		.reduce((acc, d) => acc + d.balance, 0);
	const networth = assets - liabilities;

	return (
		<Card className="w-full p-1 border-0 shadow-primary shadow-md border-t border-t-accent">
			<Background className="min-h-0">
				<CardHeader className="p-4">
					<div className="flex gap-6">
						<UserAvatar />
						<div className="flex flex-col">
							<span className={cn("text-foreground text-base")}>
								{user && user.id === "all"
									? "Combined Family"
									: user
										? user?.name
										: `${auth.firstName} ${auth.lastName}`}
							</span>
							<UserEmail />
						</div>
					</div>
					<CardAction>
						<AcctBtn isCash={!!isCash} />
					</CardAction>
				</CardHeader>
				<CardContent className="flex flex-col gap-6 p-4">
					{assets === 0 && liabilities === 0 ? (
						<div className="mx-auto text-lg font-bold">
							You have not added any accounts yet
						</div>
					) : (
						<>
							<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
								<div className="flex flex-col">
									<span className="text-muted-foreground">Total Networth</span>
									<Amount
										amount={networth}
										decimals={0}
										className="text-4xl"
										containerClass="justify-start"
									/>
								</div>
								<div className="flex justify-between w-full md:w-fit gap-8">
									<div className="flex flex-col md:items-end">
										<span className="text-xs text-success">Assets</span>
										<Amount amount={assets} decimals={0} className="text-sm" />
									</div>
									<div className="flex flex-col items-end">
										<span className="text-xs text-destructive">
											Liabilities
										</span>
										<Amount
											amount={liabilities}
											decimals={0}
											className="text-sm"
										/>
									</div>
								</div>
							</div>

							<div className="grid gap-4 mt-8">
								<span className="title text-base">Account Summary</span>
								{data.map((d, i) => (
									<Field key={d.type} className="w-full">
										<FieldLabel htmlFor={`progress-upload-${d.type}`}>
											<span className={`capitalize text-${d.color}`}>
												{d.type.toLowerCase()}
											</span>
											<Amount
												amount={d.balance}
												className="text-sm"
												containerClass="ml-auto"
											/>
										</FieldLabel>
										<Progress
											value={Math.ceil(
												(d.isAsset
													? d.balance / assets
													: d.balance / liabilities) * 100,
											)}
											id={`progress-upload-${d.type}`}
											indicatorClass={`bg-${d.color}`}
										/>
									</Field>
								))}
							</div>
						</>
					)}
				</CardContent>
			</Background>
		</Card>
	);
}
