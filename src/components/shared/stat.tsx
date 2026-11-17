import { Amount } from "@/components/shared/amount";
import { cn } from "@/lib/utils";

type Props = {
	title: string;
	total: number;
	className?: string;
	titleClass?: string;
};
export function Stat({ title, total, className, titleClass }: Props) {
	return (
		<div className={cn("grid gap-1 w-full", className)}>
			<h3
				className={cn(
					"text-xs md:text-sm font-medium text-muted-foreground w-full whitespace-nowrap",
					titleClass,
				)}
			>
				{title}
			</h3>
			<div className="flex flex-col md:flex-row md:items-center gap-2">
				<Amount
					amount={total}
					className="text-lg md:text-2xl"
					shorten
					containerClass="justify-start"
				/>
			</div>
		</div>
	);
}
