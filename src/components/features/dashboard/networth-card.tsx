import { UserAvatar } from "@clerk/tanstack-react-start";
import { UserEmail } from "@/components/features/auth/user/user-email";
import { UserName } from "@/components/features/auth/user/user-name";
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
import { AcctBtn } from "../accounts/acct-btn";

const data = [
	{ type: "savings", balance: 1143570, isAsset: true },
	{ type: "credit card", balance: 7390, isAsset: false },
	{ type: "investment", balance: 5114890, isAsset: true },
	{ type: "mortgage", balance: 1120390, isAsset: false },
	{ type: "wallet", balance: 10000, isAsset: true },
].sort((a, b) => b.balance - a.balance);

const classes = [
	"bg-chart-1",
	"bg-chart-2",
	"bg-chart-3",
	"bg-chart-4",
	"bg-chart-5",
	"text-chart-1",
	"text-chart-2",
	"text-chart-3",
	"text-chart-4",
	"text-chart-5",
];

export function NetWorthCard() {
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
							<UserName className="text-primary-foreground text-base" />
							<UserEmail />
						</div>
					</div>
					<CardAction>
						<AcctBtn />
					</CardAction>
				</CardHeader>
				<CardContent className="flex flex-col gap-6 p-4">
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
								<span className="text-xs text-destructive">Liabilities</span>
								<Amount amount={liabilities} decimals={0} className="text-sm" />
							</div>
						</div>
					</div>

					<div className="grid gap-4 mt-8">
						<span className="title text-base">Account Summary</span>
						{data.map((d, i) => (
							<Field key={d.type} className="w-full">
								<FieldLabel htmlFor={`progress-upload-${d.type}`}>
									<span className={`capitalize text-chart-${i + 1}`}>
										{d.type}
									</span>
									<Amount
										amount={d.balance}
										className="text-sm"
										containerClass="ml-auto"
									/>
								</FieldLabel>
								<Progress
									value={Math.ceil(
										(d.isAsset ? d.balance / assets : d.balance / liabilities) *
											100,
									)}
									id={`progress-upload-${d.type}`}
									indicatorClass={`bg-chart-${i + 1}`}
								/>
							</Field>
						))}
					</div>
				</CardContent>
			</Background>
		</Card>
	);
}
