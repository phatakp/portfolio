import { useAuth, useSignIn } from "@clerk/tanstack-react-start";
import { useNavigate } from "@tanstack/react-router";
import { useAppForm } from "@/components/shared/form-inputs/hooks";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { VerifyEmailSchema } from "@/lib/zod/auth.schema";

export function VerifySignInForm() {
	const { signIn } = useSignIn();
	const { isSignedIn } = useAuth();
	const navigate = useNavigate();

	const form = useAppForm({
		defaultValues: {
			code: "",
		},
		validators: {
			onSubmit: VerifyEmailSchema,
		},
		onSubmit: async ({ value }) => {
			await signIn.emailCode.verifyCode({ code: value.code });
			if (signIn.status === "complete") {
				await signIn.finalize({
					navigate: ({ session, decorateUrl }) => {
						// Handle session tasks
						// See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
						if (session?.currentTask) {
							console.log(session?.currentTask);
							return;
						}

						// If no session tasks, navigate the signed-in user to the home page
						const url = decorateUrl("/dashboard");
						if (url.startsWith("http")) {
							window.location.href = url;
						} else {
							navigate({ to: url });
						}
					},
				});
			} else if (signIn.status === "needs_second_factor") {
				// See https://clerk.com/docs/guides/development/custom-flows/authentication/multi-factor-authentication
			} else if (signIn.status === "needs_client_trust") {
				// See https://clerk.com/docs/guides/development/custom-flows/authentication/device-trust
			} else {
				// Check why the sign-in is not complete
				console.error("Sign-in attempt not complete:", signIn);
			}
		},
	});

	if (signIn.status === "complete" || isSignedIn) {
		return null;
	}

	return (
		<div className="flex flex-col gap-6 mx-auto max-w-md w-full">
			<Card>
				<CardHeader>
					<CardTitle className="title">Verify Account</CardTitle>
					<CardDescription>Enter OTP received on your email</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						className="flex flex-col gap-6"
						onSubmit={(e) => {
							e.preventDefault();
							form.handleSubmit();
						}}
					>
						<form.AppForm>
							<form.ErrorMap />

							<form.AppField name={"code"}>
								{(field) => <field.TextInput label={"Email OTP"} />}
							</form.AppField>

							<form.SubmitButton label="Submit" className="w-full" />
						</form.AppForm>
					</form>
				</CardContent>
				<CardFooter>
					<div className="flex items-center justify-end gap-4">
						<Button
							type="button"
							onClick={() => signIn.emailCode.sendCode()}
							variant={"link"}
						>
							Resend Code
						</Button>
						<Button
							type="button"
							onClick={() => signIn.reset()}
							variant={"ghost"}
						>
							Start Over
						</Button>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
