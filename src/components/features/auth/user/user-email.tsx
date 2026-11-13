import { useUser } from "@clerk/tanstack-react-start";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function UserEmail({ className }: { className?: string }) {
	const { user, isLoaded } = useUser();
	if (!isLoaded) return <Skeleton className="w-32 h-6" />;
	if (!user) return;

	return (
		<div>
			<span
				className={cn("text-sm text-muted-foreground font-number", className)}
			>
				{user.primaryEmailAddress?.emailAddress}
			</span>
		</div>
	);
}
