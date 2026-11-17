import { createFileRoute, Link } from "@tanstack/react-router";

import { Background } from "@/components/shared/background";
import { SiteLogo } from "@/components/shared/site-logo";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app.store";

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
				<div className="w-full grid md:grid-cols-3 gap-4 items-center">
					{APPS.map((app) => (
						<Card
							key={app.app}
							className={cn("w-full", currApp === app.app && "feature-card")}
						>
							<CardHeader className="md:h-20">
								<CardTitle
									className={cn(
										"text-sm md:text-base flex items-center justify-between",
										app.app === APP.KPEVENTS && "gap-12",
									)}
								>
									<SiteLogo app={app.app} />
									<span className={cn("title text-xl")}>{app.title}</span>
								</CardTitle>
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
