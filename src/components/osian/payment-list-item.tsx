import { format } from "date-fns";
import { Building2, User2 } from "lucide-react";
import { Amount } from "@/components/shared/amount";
import { Badge } from "@/components/ui/badge";
import { PAYMENT_SOURCE } from "@/lib/constants";
import type { Payment } from "@/types";
import { TableCell, TableRow } from "../ui/table";
import { PaymentBtn } from "./payment-btn";

type Props = {
	id: number;
	payment: Payment;
};
export function PaymentListItem({ id, payment }: Props) {
	return (
		<TableRow>
			<TableCell className="w-30 md:w-full">
				<div className="flex items-center gap-2">
					{payment.source === PAYMENT_SOURCE.BANK ? (
						<Building2 className="text-muted-foreground" />
					) : (
						<User2 className="text-muted-foreground" />
					)}
					<div className="flex flex-col gap-1">
						<span className=" text-sm truncate text-left w-30 md:w-full">
							{payment.description}
						</span>
						<Badge
							variant={"secondary"}
							className="text-xs text-muted-foreground rounded-md md:hidden"
						>
							{format(new Date(payment.date), "PP")}
						</Badge>

						<Badge
							variant={"secondary"}
							className="text-xs text-muted-foreground rounded-md hidden md:flex"
						>
							{payment.type}
						</Badge>
					</div>
				</div>
			</TableCell>

			<TableCell className="hidden md:table-cell">
				{format(new Date(payment.date), "PP")}
			</TableCell>

			<TableCell className="text-right">
				<Amount amount={payment.amount} className="text-sm md:text-base" />
			</TableCell>

			<TableCell>
				<PaymentBtn payment={payment} id={id} />
			</TableCell>
		</TableRow>
	);
}
