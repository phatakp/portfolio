import {
	UserButton,
	useAuth,
	useClerk,
	useUser,
} from "@clerk/tanstack-react-start";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { FingerprintPattern, LogOutIcon } from "lucide-react";
import { UserName } from "@/components/features/auth/user/user-name";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { APP, NAVLINKS, USER_ROLE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app.store";
import { SiteLogo } from "./site-logo";

export function Navbar() {
	const { isSignedIn, isLoaded } = useAuth();
	const { user, isLoaded: isUsrLoaded } = useUser();
	const { signOut } = useClerk();
	const app = useAppStore((state) => state.currApp);
	const queryClient = useQueryClient();
	const isAdmin = user?.publicMetadata?.role === USER_ROLE.ADMIN;
	const isUserLoaded = isLoaded && isUsrLoaded;
	const links = app
		? NAVLINKS.filter((l) => !l.app || l.app === app)
		: NAVLINKS.filter((l) => !l.app);

	const title = !app ? "App" : app === APP.OSIAN ? "A-1506" : "MoneyMap";

	return (
		<header
			className={cn(
				"sticky inset-x-0 top-0 z-99 items-center flex transition-colors duration-400 ease-in-out h-20",
				"bg-background/80 md:bg-transparent backdrop-blur-sm border-b md:border-none border-border",
			)}
		>
			<nav className="flex items-center justify-between w-full h-full container p-4 md:py-2">
				<Link to={"/"} className="h-full relative flex items-center gap-1">
					<SiteLogo app={app} />
					<div className="flex flex-col">
						<span
							className={cn(
								"font-bold title text-xl md:text-2xl capitalize transition-opacity duration-300 ease-in-out",
							)}
						>
							{title}
						</span>
						{isSignedIn && <UserName />}
					</div>
				</Link>

				{!isUserLoaded && <Skeleton className="size-10 rounded-full" />}
				{isSignedIn ? (
					<UserButton
						appearance={{
							elements: {
								// Targets the default internal sign-out button element and hides it from the DOM
								userButtonPopoverActionButton__signOut: { display: "none" },
							},
						}}
					>
						<UserButton.MenuItems>
							{links.map((link) => {
								if (link.isAdminOnly && !isAdmin) return null;
								return (
									<UserButton.Link
										key={link.href}
										label={link.label}
										labelIcon={link.icon}
										href={link.href}
									/>
								);
							})}

							<UserButton.Action
								label="Sign Out"
								labelIcon={<LogOutIcon className="size-3.5" />}
								onClick={async () => {
									await signOut({ redirectUrl: "/sign-in" });
									queryClient.invalidateQueries();
								}}
							/>
						</UserButton.MenuItems>
					</UserButton>
				) : (
					<Link
						to="/sign-in/$"
						className={cn(buttonVariants({ variant: "default", size: "icon" }))}
					>
						<FingerprintPattern />
					</Link>
				)}
			</nav>
		</header>
	);
}
