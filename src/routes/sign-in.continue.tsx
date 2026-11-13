import { createFileRoute } from "@tanstack/react-router";
import { ProfileForm } from "@/components/features/auth/profile-form";
import { Background } from "@/components/shared/background";

export const Route = createFileRoute("/sign-in/continue")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Background>
			<div className="flex flex-col items-center justify-center gap-6 min-h-screen">
				<ProfileForm />
			</div>
		</Background>
	);
}
