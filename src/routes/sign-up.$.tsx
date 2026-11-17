import { useAuth, useSignUp } from "@clerk/tanstack-react-start";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SignUpForm } from "@/components/features/auth/sign-up-form";
import { VerifySignUpForm } from "@/components/features/auth/verify-signup-form";
import { Background } from "@/components/shared/background";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/sign-up/$")({
	component: RouteComponent,
});

function RouteComponent() {
	const { signUp } = useSignUp();
	const { isSignedIn } = useAuth();
	const navigate = useNavigate();

	if (isSignedIn) {
		navigate({ to: "/" });
		return;
	}

	return (
		<Background>
			<div className="flex flex-col items-center justify-center gap-6 min-h-screen">
				{signUp.status === "missing_requirements" &&
				signUp.unverifiedFields.includes("email_address") &&
				signUp.missingFields.length === 0 ? (
					<VerifySignUpForm />
				) : (
					<SignUpForm />
				)}

				<div className="flex items-center gap-4 text-sm text-muted-foreground">
					Already have an account?{" "}
					<Link
						to="/sign-in/$"
						className={cn(buttonVariants({ variant: "link" }))}
					>
						Sign In
					</Link>
				</div>
				{/* Required for sign-up flows. Clerk's bot sign-up protection is enabled by default */}
				<div id="clerk-captcha" />
			</div>
		</Background>
	);
}
