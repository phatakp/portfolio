import { IndianRupee } from "lucide-react";
import { amountFormatter, amountShortener, cn } from "@/lib/utils";

type Props = {
	amount: number;
	className?: string;
	containerClass?: string;
	iconClass?: string;
	decimalClass?: string;
	decimals?: number;
	shorten?: boolean;
};

export function Amount({
	amount,
	className,
	containerClass,
	iconClass,
	decimalClass,
	shorten,
	decimals = 0,
}: Props) {
	const formattedAmount = amountFormatter(amount, decimals).toString();
	let integerPart: string | undefined;
	let decimalPart: string | undefined;
	if (formattedAmount.includes(".")) {
		const [i, d] = formattedAmount.split(".");
		integerPart = i;
		decimalPart = d;
	}
	return (
		<div className={cn("flex items-center justify-end", containerClass)}>
			<IndianRupee
				className={cn("size-3.5 text-muted-foreground", iconClass)}
			/>
			{integerPart && decimalPart ? (
				<div className="flex items-end font-number">
					<span
						className={cn("font-semibold text-2xl tabular-nums", className)}
					>
						{integerPart}
					</span>
					<span
						className={cn(
							"font-semibold text-lg tabular-nums text-muted-foreground",
							decimalClass,
						)}
					>
						.{decimalPart}
					</span>
				</div>
			) : shorten ? (
				<span className={cn("font-semibold text-2xl tabular-nums", className)}>
					{amountShortener(amount)}
				</span>
			) : (
				<span className={cn("font-semibold text-2xl tabular-nums", className)}>
					{amountFormatter(amount, decimals)}
				</span>
			)}
		</div>
	);
}
