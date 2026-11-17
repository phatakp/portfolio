import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
	useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { useEffect } from "react";
import { getLoggedInUser } from "@/api/auth/auth.functions";
import { Navbar } from "@/components/shared/navbar";
import { ReactHotToast } from "@/integrations/react-toast";
import TanStackQueryProvider from "@/integrations/tanstack-query/root-provider";
import { useAppStore } from "@/stores/app.store";
import ClerkProvider from "../integrations/clerk/provider";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Portfolio",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
	beforeLoad: async () => {
		const auth = await getLoggedInUser();
		return { auth }; // Injected into router context
	},
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const syncApp = useAppStore((state) => state.syncFromStorage);
	const location = useLocation();
	const isHome = location.pathname === "/";

	useEffect(() => {
		syncApp();
	}, [syncApp]);

	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body className="bg-gradient text-foreground">
				<TanStackQueryProvider>
					<ClerkProvider>
						{isHome ? null : <Navbar />}
						<main className="relative min-h-[calc(100vh-2rem)]">
							{children}
						</main>
						<ReactHotToast />
						<TanStackDevtools
							config={{
								position: "bottom-right",
							}}
							plugins={[
								{
									name: "Tanstack Router",
									render: <TanStackRouterDevtoolsPanel />,
								},
								TanStackQueryDevtools,
							]}
						/>
					</ClerkProvider>
				</TanStackQueryProvider>
				<Scripts />
			</body>
		</html>
	);
}
