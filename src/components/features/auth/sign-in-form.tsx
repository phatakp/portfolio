import { useSignIn } from "@clerk/tanstack-react-start";
import { MailIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useAppForm } from "@/components/shared/form-inputs/hooks";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { LoginSchema } from "@/lib/zod/auth.schema";
import { GoogleSignInBtn } from "./google-signin-btn";

export function SignInForm() {
	const { signIn } = useSignIn();

	const form = useAppForm({
		defaultValues: {
			email: "",
		},
		validators: {
			onSubmit: LoginSchema,
		},
		onSubmit: async ({ value }) => {
			const { error } = await signIn.create({ identifier: value.email });
			if (!error) {
				await signIn.emailCode.sendCode({ emailAddress: value.email });
				toast.success("Check your email for the verification code.");
			} else {
				console.error(error);
				toast.error(error.message);
			}
		},
	});
	return (
		<div className="flex flex-col gap-6 mx-auto max-w-md w-full">
			<Card>
				<CardHeader>
					<CardTitle className="title">Sign In</CardTitle>
					<CardDescription>
						Enter details to login to your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						className="flex flex-col gap-8"
						onSubmit={(e) => {
							e.preventDefault();
							form.handleSubmit();
						}}
					>
						<form.AppForm>
							<form.ErrorMap />

							<form.AppField name={"email"}>
								{(field) => (
									<field.TextInput
										icon={<MailIcon className="size-4 text-muted-foreground" />}
										label="Email"
									/>
								)}
							</form.AppField>

							<form.SubmitButton label="Submit" className="w-full" />
						</form.AppForm>
					</form>
					<GoogleSignInBtn />
				</CardContent>
			</Card>
		</div>
	);
}
