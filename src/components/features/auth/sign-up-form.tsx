import { useSignUp } from "@clerk/tanstack-react-start";
import { toast } from "react-hot-toast";
import { useAppForm } from "@/components/shared/form-inputs/hooks";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { RegisterSchema } from "@/lib/zod/auth.schema";
import { GoogleSignInBtn } from "./google-signin-btn";

export function SignUpForm() {
	const { signUp } = useSignUp();
	const form = useAppForm({
		defaultValues: {
			email: "",
			firstName: "",
			lastName: "",
		},
		validators: {
			onSubmit: RegisterSchema,
		},
		onSubmit: async ({ value }) => {
			const { error } = await signUp.create({
				emailAddress: value.email,
				firstName: value.firstName,
				lastName: value.lastName,
			});
			if (!error) {
				await signUp.verifications.sendEmailCode();
				toast.success("Check your email for the verification code.");
			} else {
				console.error(error);
				toast.error(error.message);
			}
		},
	});
	return (
		<div className="flex flex-col gap-6 mx-auto max-w-md w-full">
			<Card className="feature-card">
				<CardHeader>
					<CardTitle className="title">Sign Up</CardTitle>
					<CardDescription>
						Enter details to create your account
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
								{(field) => <field.TextInput label={"Email"} />}
							</form.AppField>

							<form.AppField name={"firstName"}>
								{(field) => <field.TextInput label={"First Name"} />}
							</form.AppField>

							<form.AppField name={"lastName"}>
								{(field) => <field.TextInput label={"Last Name"} />}
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
