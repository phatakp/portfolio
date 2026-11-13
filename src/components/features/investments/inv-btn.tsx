import { Pen, PlusIcon, Trash } from "lucide-react";
import { Modal } from "@/components/shared/modal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Investment } from "@/types";
import { InvForm } from "./inv-form";

type Props = {
	inv?: Investment;
	invId?: number;
	isDelete?: boolean;
	children?: React.ReactNode;
	className?: string;
};
export function InvBtn({ inv, invId, isDelete, children, className }: Props) {
	return (
		<Modal
			btnClass={cn(
				buttonVariants({
					size: isDelete ? "icon-xs" : "sm",
					variant: isDelete ? "destructive" : invId ? "ghost" : "default",
				}),
				className,
			)}
			title={
				!invId
					? `Add Investment Details`
					: isDelete
						? `Delete Investment`
						: `Edit Investment Details`
			}
			content={<InvForm inv={inv} invId={invId} isDelete={isDelete} />}
		>
			{!invId && (
				<>
					<PlusIcon className="size-4" />
					<span className="text-sm hidden md:flex">New Investment</span>
				</>
			)}

			{!!invId && isDelete && <Trash className="size-3.5" />}

			{!!invId && !isDelete && !children && <Pen className="size-4" />}
			{!!invId && !isDelete && children && children}
		</Modal>
	);
}
