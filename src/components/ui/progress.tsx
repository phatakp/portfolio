import { cn } from "cn";
import { Progress as ProgressPrimitive } from "radix-ui";
import type * as React from "react";

function Progress({
	className,
	value,
	indicatorClass,
	...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
	indicatorClass?: string;
}) {
	return (
		<ProgressPrimitive.Root
			data-slot="progress"
			className={cn(
				"relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
				className,
			)}
			{...props}
		>
			<ProgressPrimitive.Indicator
				data-slot="progress-indicator"
				className={cn(
					"h-full w-full flex-1 bg-primary transition-all",
					indicatorClass,
				)}
				style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
			/>
		</ProgressPrimitive.Root>
	);
}

export { Progress };
