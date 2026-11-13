import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { AmountInput } from "./amount-input";
import { DateInput } from "./date-select";
import { FormErrorMap } from "./form-error";
import { SelectInput } from "./select-input";
import { SubmitButton } from "./submit-button";
import { TextInput } from "./text-input";

const { fieldContext, formContext, useFieldContext, useFormContext } =
	createFormHookContexts();

const { useAppForm, withFieldGroup, withForm, useTypedAppFormContext } =
	createFormHook({
		fieldComponents: {
			TextInput,
			SelectInput,
			DateInput,
			AmountInput,
		},
		formComponents: {
			SubmitButton,
			ErrorMap: FormErrorMap,
		},
		fieldContext,
		formContext,
	});

export {
	useAppForm,
	useFieldContext,
	useFormContext,
	useTypedAppFormContext,
	withFieldGroup,
	withForm,
};
