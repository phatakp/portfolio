/** biome-ignore-all lint/a11y/useSemanticElements: <ignore> */

import { XIcon } from "lucide-react";

import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";
import { cn, formatAcctNumber } from "@/lib/utils";
import { type FormBaseProps, FormInputBase } from "./base";
import { useFieldContext } from "./hooks";

type Props = FormBaseProps & {
	showClearButton?: boolean;
	formatValue?: boolean;
};

export const TextInput = ({
	showClearButton = false,
	formatValue = false,
	icon,
	...props
}: Props) => {
	const field = useFieldContext<string | undefined>();
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
	const {
		value: _ignoredValue,
		onChange: _ignoredOnChange,
		...cleanProps
	} = props;

	return (
		<FormInputBase {...props}>
			<InputGroup className={cn(props.disabled && "ring-0 border-0 outline-0")}>
				{icon && <InputGroupAddon>{icon}</InputGroupAddon>}
				<InputGroupInput
					{...cleanProps}
					placeholder={props.label}
					name={field.name}
					value={field.state.value ?? ""}
					onBlur={field.handleBlur}
					onChange={(e) =>
						field.handleChange(
							e.target.value === ""
								? undefined
								: formatValue
									? formatAcctNumber(e.target.value)
									: e.target.value,
						)
					}
					onFocus={(e) => e.target.select()}
					aria-invalid={isInvalid}
					className={cn(
						"w-full text-sm",
						props.disabled && "ring-0 border-0 outline-0 pl-4",
					)}
				/>
				{showClearButton && field.state.value && (
					<InputGroupAddon align="inline-end">
						<InputGroupButton
							aria-label="Clear"
							title="Clear"
							size="icon-xs"
							onClick={() => {
								field.setValue("");
							}}
						>
							<XIcon />
						</InputGroupButton>
					</InputGroupAddon>
				)}
			</InputGroup>
		</FormInputBase>
	);
};
