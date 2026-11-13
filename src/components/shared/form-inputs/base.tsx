/** biome-ignore-all lint/a11y/useSemanticElements: <ignore> */

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { useFieldContext } from "./hooks";

export type FormBaseProps = ComponentPropsWithoutRef<"input"> & {
	label: string;
	labelClass?: string;
	icon?: ReactNode;
	description?: ReactNode;
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
	description,
	required = true,
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
				{props.disabled ? (
					<span className="text-xs transition-all duration-500 ease-in-out text-muted-foreground">
						{label}
					</span>
				) : (
					<FieldLabel
						htmlFor={field.name}
						className={cn(
							"text-xs transition-all duration-500 ease-in-out text-muted-foreground",
							field.state.value || parseInt(field.state.value ?? "", 10) === 0
								? " absolute -top-2.5 left-3 z-10 px-1 bg-background/90"
								: "hidden",
							labelClass,
						)}
					>
						{label} {!required && "(Optional)"}
					</FieldLabel>
				)}

				{props.disabled ? (
					<Badge className="rounded-sm py-2" variant={variant}>
						{field.state.value === "" || field.state.value === "0"
							? "N/A"
							: field.state.value}
					</Badge>
				) : (
					children
				)}
				{description && <FieldDescription>{description}</FieldDescription>}
				{isInvalid && <FieldError errors={field.state.meta.errors} />}
			</FieldContent>
		</Field>
	);
};
