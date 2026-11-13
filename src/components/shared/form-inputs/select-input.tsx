/** biome-ignore-all lint/a11y/useSemanticElements: <ignore> */
import { Check, ChevronsUpDown, Plus, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { SelectOption } from "@/types";
import { type FormBaseProps, FormInputBase } from "./base";
import { useFieldContext } from "./hooks";

type Props = FormBaseProps & {
	options: SelectOption[];
	isCreatable?: boolean;
	onCreate?: (val: string) => void;
	onSelect?: () => void;
};

export const SelectInput = ({
	options,
	icon,
	isCreatable = false,
	onCreate,
	onSelect,
	className,
	...props
}: Props) => {
	const field = useFieldContext<string | undefined>();

	const [currValue, setCurrValue] = useState<SelectOption | undefined>(
		undefined,
	);

	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState<SelectOption>(
		currValue ?? { label: "", value: "" },
	);
	const [search, setSearch] = useState("");

	useEffect(() => {
		const value = options.find((o) => o.value === field.state.value);
		setCurrValue(value);
		setSelected(value ?? { label: "", value: "" });
	}, [field.state.value, options]);

	const handleCreate = () => {
		if (search && !options.find((i) => i.value === search)) {
			setSelected({ value: search.toLowerCase(), label: search });
			setOpen(false);
			setSearch("");
			onCreate?.(search);
		}
	};

	return (
		<FormInputBase {...props}>
			<Popover onOpenChange={setOpen} open={open}>
				<PopoverTrigger asChild>
					<Button
						aria-expanded={open}
						className={cn(
							"w-full justify-between capitalize h-10 bg-transparent",
							!selected?.value ? "text-muted-foreground" : "text-foreground",
							"disabled:border-0 disabled:ring-0 disabled:outline-0 disabled:pl-4",
							className,
						)}
						variant="outline"
						disabled={props.disabled}
					>
						<span className="flex items-center gap-2">
							{icon && icon}
							{selected?.value ? selected.label : `Select ${props.label}...`}
						</span>
						<ChevronsUpDown
							className={cn(
								"ml-2 size-4 shrink-0 opacity-50",
								props.disabled && "hidden",
							)}
						/>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-full p-0 sm:min-w-75">
					<Command>
						<CommandInput
							onValueChange={setSearch}
							placeholder={`Search ${isCreatable ? "or create" : ""}...`}
							value={search}
						/>
						<CommandList>
							<CommandEmpty>
								{isCreatable ? (
									<Button
										className="w-full justify-start"
										onClick={handleCreate}
										variant="ghost"
									>
										<Plus className="mr-2 size-4" />
										Create "{search}"
									</Button>
								) : (
									"No results found."
								)}
							</CommandEmpty>
							<CommandGroup>
								{currValue && (
									<CommandItem
										className="text-destructive hover:text-destructive/80"
										onSelect={() => {
											setSelected({
												label: "",
												value: "",
											});
											field.setValue(undefined);
											setOpen(false);
										}}
										value={undefined}
									>
										<XIcon
											className={cn(
												"mr-2 size-4 text-destructive hover:text-destructive/80",
											)}
										/>
										Clear selection
									</CommandItem>
								)}
								{options.map((item) => (
									<CommandItem
										key={item.value}
										className="capitalize"
										onSelect={(currentValue) => {
											setOpen(false);
											const opt = options.find((i) => i.value === currentValue);
											setSelected(opt ?? { label: "", value: "" });
											field.setValue(currentValue);
											if (onSelect) onSelect();
										}}
										value={item.value}
									>
										<Check
											className={cn(
												"mr-2 size-4",
												selected?.value === item.value
													? "opacity-100"
													: "opacity-0",
											)}
										/>
										{item.label}
									</CommandItem>
								))}
							</CommandGroup>
							{search &&
								!options.find((i) => i.value === search) &&
								options.length > 0 &&
								isCreatable && (
									<>
										<CommandSeparator />
										<CommandGroup>
											<CommandItem onSelect={handleCreate}>
												<Plus className="mr-2 size-4" />
												Create "{search}"
											</CommandItem>
										</CommandGroup>
									</>
								)}
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</FormInputBase>
	);
};
