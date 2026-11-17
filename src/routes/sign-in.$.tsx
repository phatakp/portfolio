import { useAuth, useSignIn } from "@clerk/tanstack-react-start";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SignInForm } from "@/components/features/auth/sign-in-form";
import { VerifySignInForm } from "@/components/features/auth/verify-signin-form";
import { Background } from "@/components/shared/background";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/sign-in/$")({
	component: RouteComponent,
});

function RouteComponent() {
	const { signIn } = useSignIn();
	const { isSignedIn } = useAuth();
	const navigate = useNavigate();

	if (isSignedIn) {
		navigate({ to: "/" });
		return;
	}

	return (
		<Background>
			<div className="flex flex-col items-center justify-center gap-6 min-h-screen">
				{signIn.status === "needs_first_factor" ? (
					<VerifySignInForm />
				) : (
					<SignInForm />
				)}

				<div className="flex items-center gap-4 text-sm text-muted-foreground bg-background">
					Don't have an account?{" "}
					<Link
						to="/sign-up/$"
						className={cn(buttonVariants({ variant: "link" }))}
					>
						Sign Up
					</Link>
				</div>
			</div>
		</Background>
	);
}
