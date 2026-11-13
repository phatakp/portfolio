import { useSignUp } from "@clerk/tanstack-react-start";
import { useNavigate } from "@tanstack/react-router";
import { useAppForm } from "@/components/shared/form-inputs/hooks";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ProfileSchema } from "@/lib/zod/auth.schema";

export function ProfileForm() {
	const { signUp } = useSignUp();
	const navigate = useNavigate();

	const form = useAppForm({
		defaultValues: {
			firstName: "",
			lastName: "",
		},
		validators: {
			onSubmit: ProfileSchema,
		},
		onSubmit: async ({ value }) => {
			const { firstName, lastName } = value;

			await signUp.update({ firstName, lastName });

			if (signUp.status === "complete") {
				await signUp.finalize({
					navigate: async ({ session, decorateUrl }) => {
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
			} else if (signUp.status !== "missing_requirements") {
				// Check why the sign-up is not complete
				console.error("Sign-up attempt not complete:", signUp.status);
			}

			// If the sign-up is complete, the user shouldn't be on this page
			if (signUp.status === "complete") {
				navigate({ to: "/dashboard" });
			}
		},
	});
	return (
		<div className="flex flex-col gap-6 mx-auto max-w-md w-full">
			<Card>
				<CardHeader>
					<CardTitle className="title">Complete Profile</CardTitle>
					<CardDescription>
						Enter details to create your profile
					</CardDescription>
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

							<form.AppField name={"firstName"}>
								{(field) => <field.TextInput label={"First Name"} />}
							</form.AppField>

							<form.AppField name={"lastName"}>
								{(field) => <field.TextInput label={"Last Name"} />}
							</form.AppField>

							<form.SubmitButton label="Submit" className="w-full" />
						</form.AppForm>
					</form>
					{/* Required for sign-up flows. Clerk's bot sign-up protection is enabled by default */}
					<div id="clerk-captcha" />
				</CardContent>
			</Card>
		</div>
	);
}
