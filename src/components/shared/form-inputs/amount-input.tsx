/** biome-ignore-all lint/a11y/useSemanticElements: <ignore> */

import { IndianRupeeIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from "@/components/ui/input-group";
import { amountFormatter, cn } from "@/lib/utils";
import { type FormBaseProps, FormInputBase } from "./base";
import { useFieldContext } from "./hooks";

type Props = FormBaseProps & {
	showClearButton?: boolean;
};

export const AmountInput = ({
	showClearButton = false,
	className,
	...props
}: Props) => {
	const field = useFieldContext<number | undefined>();
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

	const formattedValue = useCallback(() => {
		if (field.state.value && field.state.value > 0) {
			const splitNums = String(field.state.value).split(".");
			const decimalPlaces = splitNums.length > 1 ? splitNums[1].length : 0;
			return amountFormatter(field.state.value, decimalPlaces);
		} else {
			return "";
		}
	}, [field.state.value]);

	const [displayValue, setDisplayValue] = useState<string>(() =>
		formattedValue(),
	);

	useEffect(() => {
		setDisplayValue(formattedValue());
	}, [formattedValue]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// Strip out all characters except digits and decimal points
		const cleaned = e.target.value.replace(/[^0-9.]/g, "");
		if (cleaned.endsWith(".")) {
			setDisplayValue(cleaned);
			return;
		}
		if (cleaned === "" || cleaned === ".") {
			field.handleChange(0);
		} else {
			const numericValue = parseFloat(cleaned);
			if (!Number.isNaN(numericValue)) {
				field.handleChange(numericValue);
			}
		}
	};

	return (
		<FormInputBase {...props}>
			<InputGroup
				className={cn(props.disabled && "ring-0 border-0 outline-0", className)}
			>
				<InputGroupAddon>
					<IndianRupeeIcon className="size-3 text-muted-foreground" />
				</InputGroupAddon>
				<InputGroupInput
					{...props}
					placeholder={props.label}
					type="text"
					name={field.name}
					value={displayValue}
					onBlur={field.handleBlur}
					onChange={handleChange}
					onFocus={(e) => e.target.select()}
					aria-invalid={isInvalid}
					className={cn(
						"w-full text-sm",
						props.disabled && "ring-0 border-0 outline-0 pl-4",
					)}
				/>
				<InputGroupAddon align="inline-end">
					<InputGroupText className="text-xs">INR</InputGroupText>
				</InputGroupAddon>
			</InputGroup>
		</FormInputBase>
	);
};
