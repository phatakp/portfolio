import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Brain,
	Goal,
	PiggyBank,
	ShieldCheck,
	WalletMinimalIcon,
} from "lucide-react";
import { Background } from "@/components/shared/background";
import { SiteLogo } from "@/components/shared/site-logo";
import { Badge } from "@/components/ui/badge";
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
		{
			title: "KP Events",
			app: APP.KPEVENTS,
			link: "https://kpevents.vercel.app",
		},
	];

	return (
		<Background>
			<div className="flex flex-col items-center gap-8 px-4 pt-8 container">
				<Badge>Portfolio</Badge>
				<h1 className="title text-7xl text-center">Praveen Phatak</h1>
				<div className="w-full grid grid-cols-2 md:grid-cols-3 gap-4 items-center justify-center mx-auto">
					{APPS.map((app) => (
						<Card
							key={app.app}
							className={cn(currApp === app.app && "feature-card")}
						>
							<CardHeader>
								<CardTitle className="text-sm md:text-base">
									<SiteLogo app={app.app} />
								</CardTitle>
								<CardDescription>{app.title}</CardDescription>
							</CardHeader>
							<CardContent>
								<Link
									to={app.link}
									className={cn(
										buttonVariants({
											variant: currApp === app.app ? "default" : "link",
										}),
										"capitalize w-max",
									)}
									onClick={() => saveApp(app.app)}
								>
									Go to App
								</Link>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</Background>
	);
}
