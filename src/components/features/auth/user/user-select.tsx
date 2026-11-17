import { useSelector } from "@tanstack/react-form";
import { useEffect } from "react";
import { useAppForm } from "@/components/shared/form-inputs/hooks";
import { Route } from "@/routes/__root";
import { useAppStore } from "@/stores/app.store";

export function UserSelect() {
	const { auth } = Route.useRouteContext();

	const form = useAppForm({
		defaultValues: {
			userId: auth.userId as string,
		},
		onSubmit: async () => {},
	});
	const userId = useSelector(form.store, (state) => state.values.userId);
	const saveUser = useAppStore((state) => state.saveUser);

	useEffect(() => {
		saveUser({
			id: auth.userId as string,
			name: `${auth.firstName} ${auth.lastName}`,
		});
	}, [saveUser, auth.userId, auth.firstName, auth.lastName]);

	const options = [
		{
			label: "Praveen Phatak",
			value: "user_2wqr2Q86DsbScICuRHE4QJShbjT",
		},
		{
			label: "Parul Choubey",
			value: "user_3IrEXfi3lGEmE2tAWMuP1wJlDuT",
		},
		{
			label: "All",
			value: "all",
		},
	];

	if (!auth.userId) return null;

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<form.AppField
				name="userId"
				listeners={{
					onChange: ({ value }) => {
						// Accessing external state here will still be stale if it relies on closures,
						// but you can safely trigger state setters:
						saveUser({
							id: value,
							name: options.find((o) => o.value === value)?.label as string,
						});
					},
				}}
			>
				{(field) => {
					return (
						<field.SelectInput
							defaultValue={auth.userId}
							value={userId}
							onChange={(e) => {
								field.setValue(e.target.value);
							}}
							label={"Show Data For"}
							options={options}
							className="min-w-40"
						/>
					);
				}}
			</form.AppField>
		</form>
	);
}
