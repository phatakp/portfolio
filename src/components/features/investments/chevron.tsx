import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
	gains: number;
	currValue: number;
};
export function Chevron({ gains, currValue }: Props) {
	return (
		<div className="flex items-center">
			{gains < 0 ? (
				<ChevronDown className="size-4 text-destructive" />
			) : (
				<ChevronUp className="size-4 text-success" />
			)}
			<span
				className={cn(
					"text-xs",
					gains < 0 ? "text-destructive" : "text-success",
				)}
			>
				{((gains / (currValue - gains)) * 100).toFixed(1)}%
			</span>
		</div>
	);
}
