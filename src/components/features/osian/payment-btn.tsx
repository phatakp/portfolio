import { EyeIcon, PlusIcon } from "lucide-react";
import { Modal } from "@/components/shared/modal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Payment } from "@/types";
import { PaymentForm } from "./payment-form";

type Props = {
	payment?: Payment;
	id?: number;
	isDelete?: boolean;
	children?: React.ReactNode;
	className?: string;
};
export function PaymentBtn({ payment, id, isDelete, className }: Props) {
	return (
		<Modal
			btnClass={cn(
				buttonVariants({
					size: isDelete || id ? "icon-xs" : "sm",
					variant: isDelete ? "destructive" : id ? "ghost" : "default",
				}),
				className,
			)}
			title={
				!id
					? `Add Payment Details`
					: isDelete
						? `Delete Payment`
						: `Edit Payment Details`
			}
			content={<PaymentForm payment={payment} id={id} isDelete={isDelete} />}
		>
			{!id && (
				<>
					<PlusIcon className="size-4" />
					<span className="text-sm hidden md:flex">New Payment</span>
				</>
			)}

			{!!id && <EyeIcon className="size-3.5 text-muted-foreground" />}
		</Modal>
	);
}
