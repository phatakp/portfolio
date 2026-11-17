/** biome-ignore-all lint/a11y/useSemanticElements: <ignore> */

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useFieldContext } from "./hooks";

export type FormBaseProps = ComponentPropsWithoutRef<"input"> & {
	label: string;
	labelClass?: string;
	descClass?: string;
	icon?: ReactNode;
	description?: ReactNode;
	isLoading?: boolean;
	variant?:
		| "default"
		| "secondary"
		| "destructive"
		| "outline"
		| "ghost"
		| "link"
		| "success";
};

export const FormInputBase = ({
	children,
	label,
	labelClass,
	descClass,
	description,
	required = true,
	isLoading = false,
	variant = "outline",
	...props
}: FormBaseProps) => {
	const field = useFieldContext<string | undefined>();
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

	return (
		<Field
			data-invalid={isInvalid}
			className="transition-all duration-500 ease-in-out"
		>
			<FieldContent className="relative transition-all duration-500 ease-in-out">
				<FieldLabel
					htmlFor={field.name}
					className={cn(
						"text-xs transition-all duration-500 ease-in-out text-muted-foreground",
						" absolute -top-2.5 left-3 z-10 px-1 bg-background/90",
						labelClass,
					)}
				>
					{label} {!required && "(Optional)"}
				</FieldLabel>

				{isLoading ? <Skeleton className="h-10 w-full" /> : children}
				{description && (
					<FieldDescription className={cn("text-xs", descClass)}>
						{description}
					</FieldDescription>
				)}
				{isInvalid && <FieldError errors={field.state.meta.errors} />}
			</FieldContent>
		</Field>
	);
};
