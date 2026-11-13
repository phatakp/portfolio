import { XIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item";

export function ReactHotToast() {
	return (
		<Toaster
			position="top-center"
			reverseOrder={false}
			toastOptions={{
				style: {
					border: "1px solid var(--color-popover-foreground)",
					padding: "16px",
					backgroundColor: "var(--color-card)",
					color: "var(--color-card-foreground)",
				},
				success: {
					style: {
						border: "1px solid var(--color-success)",
						backgroundColor: "var(--color-success)",
						color: "var(--color-success-foreground)",
					},
				},
				error: {
					style: {
						border: "1px solid var(--color-destructive)",
						backgroundColor: "var(--color-destructive)",
						color: "var(--color-destructive-foreground)",
					},
				},
			}}
		/>
	);
}

export function successToast(message: string) {
	return toast.custom((t) => (
		<Item
			variant="outline"
			className="bg-success text-success-foreground relative"
		>
			<ItemMedia>
				<Avatar className="size-6">
					<AvatarImage src="https://res.cloudinary.com/dgpvaaxwq/image/upload/v1780298270/logo_yggcsx.png" />
					<AvatarFallback>MM</AvatarFallback>
				</Avatar>
			</ItemMedia>
			<ItemContent>
				<ItemTitle>SUCCESS</ItemTitle>
				<ItemDescription className="text-success-foreground">
					{message}
				</ItemDescription>
			</ItemContent>
			<Button
				onClick={() => toast.dismiss(t.id)}
				size="icon-sm"
				variant="success"
				className="rounded-full absolute right-4 top-2"
			>
				<XIcon />
			</Button>
		</Item>
	));
}

export function errorToast(code: string, message: string) {
	return toast.custom((t) => (
		<Item
			variant="outline"
			className="bg-destructive text-destructive-foreground relative"
		>
			<ItemMedia>
				<Avatar className="size-6">
					<AvatarImage src="https://res.cloudinary.com/dgpvaaxwq/image/upload/v1780298270/logo_yggcsx.png" />
					<AvatarFallback>MM</AvatarFallback>
				</Avatar>
			</ItemMedia>
			<ItemContent>
				<ItemTitle>{code}</ItemTitle>
				<ItemDescription className="text-destructive-foreground">
					{message}
				</ItemDescription>
			</ItemContent>
			<Button
				onClick={() => toast.dismiss(t.id)}
				size="icon-sm"
				variant="destructive"
				className="rounded-full absolute right-4 top-2"
			>
				<XIcon />
			</Button>
		</Item>
	));
}
