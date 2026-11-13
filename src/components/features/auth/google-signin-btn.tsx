import { useSignIn } from "@clerk/tanstack-react-start";
import type { OAuthStrategy } from "@clerk/tanstack-react-start/types";
import { Image } from "@unpic/react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

export function GoogleSignInBtn() {
	const { signIn } = useSignIn();

	const signInWith = async (strategy: OAuthStrategy) => {
		const { error } = await signIn.sso({
			strategy,
			redirectCallbackUrl: "/sso",
			redirectUrl: "/dashboard", // Learn more about session tasks at https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
		});
		if (error) {
			// See https://clerk.com/docs/guides/development/custom-flows/error-handling
			// for more info on error handling
			console.error(JSON.stringify(error, null, 2));
			toast.error(error.message);
			return;
		}

		if (signIn.status === "needs_second_factor") {
			// See https://clerk.com/docs/guides/development/custom-flows/authentication/multi-factor-authentication
		} else if (signIn.status === "needs_client_trust") {
			// See https://clerk.com/docs/guides/development/custom-flows/authentication/device-trust
		} else {
			// Check why the sign-in is not complete
			console.error("Sign-in attempt not complete:", signIn);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center pt-8 gap-8">
			<div className="w-full h-0.5 bg-input relative">
				<span className="text-xs text-muted-foreground absolute bg-background left-1/2 top-1/2 -translate-1/2 px-4">
					or
				</span>
			</div>
			<Button
				type="button"
				variant={"secondary"}
				className="w-full"
				onClick={() => signInWith("oauth_google")}
			>
				<Image src="./google.png" alt="google" width={24} height={24} />
				Use Google Account
			</Button>
		</div>
	);
}
