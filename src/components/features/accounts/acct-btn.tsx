import { Pen, PlusIcon, Trash } from "lucide-react";
import { Modal } from "@/components/shared/modal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Account } from "@/types";
import { AcctForm } from "./acct-form";

type Props = {
	acct?: Account;
	acctId?: number;
	isDelete?: boolean;
	children?: React.ReactNode;
	className?: string;
};
export function AcctBtn({
	acct,
	acctId,
	isDelete,
	children,
	className,
}: Props) {
	return (
		<Modal
			btnClass={cn(
				buttonVariants({
					size: isDelete ? "icon-xs" : "sm",
					variant: isDelete ? "destructive" : acctId ? "ghost" : "default",
				}),
				className,
			)}
			title={
				!acctId
					? `Add Account Details`
					: isDelete
						? `Delete Account`
						: `Edit Account Details`
			}
			content={<AcctForm acct={acct} acctId={acctId} isDelete={isDelete} />}
		>
			{!acctId && (
				<>
					<PlusIcon className="size-4" />
					<span className="text-sm hidden md:flex">New Account</span>
				</>
			)}

			{!!acctId && isDelete && <Trash className="size-3.5" />}

			{!!acctId && !isDelete && !children && <Pen className="size-4" />}
			{!!acctId && !isDelete && children && children}
		</Modal>
	);
}
