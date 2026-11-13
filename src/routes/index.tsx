import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Brain,
	Goal,
	PiggyBank,
	ShieldCheck,
	WalletMinimalIcon,
} from "lucide-react";
import { Background } from "@/components/shared/background";
import { buttonVariants } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { APP } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app.store";

const TABS = [
	{
		title: "Expense Tracking",
		desc: "Categorize your transactions and track where your money goes",
		icon: <WalletMinimalIcon />,
	},
	{
		title: "Investment Tracking",
		desc: "Monitor stocks, mutual funds, and other investments in one place",
		icon: <PiggyBank />,
	},
	{
		title: "Financial Goals",
		desc: "Plan vacations, home purchase, retirement or emergency funds",
		icon: <Goal />,
	},
	{
		title: "Smart Insights",
		desc: "Receive personalized recommendations to optimize your savings",
		icon: <Brain />,
	},
	{
		title: "Security",
		desc: "Encryption, 2FA, and regular security audits to protect your data",
		icon: <ShieldCheck />,
	},
];

const LOGOS = [
	{ src: "./logos/sbi.png", title: "SBI", height: 24, className: "uppercase" },
	{
		src: "./logos/hdfc.png",
		title: "HDFC Bank",
		height: 32,
		className: "capitalize",
	},
	{
		src: "./logos/icici.png",
		title: "ICICI Bank",
		height: 24,
		className: "capitalize",
	},
	{
		src: "./logos/zerodha.png",
		title: "Zerodha",
		height: 24,
		className: "uppercase",
	},
	{
		src: "./logos/groww.png",
		title: "Groww",
		height: 24,
		className: "font-heading capitalize",
	},
	{
		src: "./logos/policybazaar.png",
		title: "policybazaar",
		height: 24,
		className: "font-heading",
	},
];

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	const currApp = useAppStore((state) => state.currApp);
	const saveApp = useAppStore((state) => state.saveApp);

	const APPS = [
		{ title: "MoneyMap", app: APP.MONEYMAP, link: "/moneymap/dashboard" },
		{ title: "Osian Almanova", app: APP.OSIAN, link: "/osian/dashboard" },
	];

	return (
		<Background>
			<div className="flex flex-col gap-8 px-4 pt-8 container">
				<Card>
					<CardHeader>
						<CardTitle className="title">Select App</CardTitle>
						<CardDescription>
							{currApp ? `Current App: ${currApp}` : null}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col gap-8">
							{APPS.map((app) => (
								<Link
									key={app.app}
									to={app.link}
									className={cn(
										buttonVariants({
											variant: currApp === app.app ? "default" : "outline",
										}),
										"capitalize w-max",
									)}
									onClick={() => saveApp(app.app)}
								>
									{app.title}
								</Link>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</Background>
	);
}
