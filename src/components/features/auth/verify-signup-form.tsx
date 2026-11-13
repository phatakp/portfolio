import { useAuth, useSignUp } from "@clerk/tanstack-react-start";
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

export function VerifySignUpForm() {
	const { signUp } = useSignUp();
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
			await signUp.verifications.verifyEmailCode({ code: value.code });
			if (signUp.status === "complete") {
				await signUp.finalize({
					navigate: ({ session, decorateUrl }) => {
						if (session?.currentTask) {
							console.log(session?.currentTask);
							return;
						}

						const url = decorateUrl("/dashboard");
						if (url.startsWith("http")) {
							window.location.href = url;
						} else {
							navigate({ to: url });
						}
					},
				});
			}
		},
	});

	if (signUp.status === "complete" || isSignedIn) {
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
					<Button
						type="button"
						onClick={() => signUp.verifications.sendEmailCode()}
						variant={"link"}
					>
						Resend Code
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
