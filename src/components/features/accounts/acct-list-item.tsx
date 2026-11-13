import { ChevronRight } from "lucide-react";
import { Amount } from "@/components/shared/amount";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { last4 } from "@/lib/utils";
import type { Account } from "@/types";
import { AcctBtn } from "./acct-btn";

type Props = {
	acctId: number;
	acct: Account;
};
export function AcctListItem({ acctId, acct }: Props) {
	const isCash = acct.bank.toLowerCase() === "cash";
	return (
		<div className="flex items-center gap-2 w-full">
			{isCash ? (
				<Button variant={"ghost"} size={"icon-xs"} disabled></Button>
			) : (
				<AcctBtn acct={acct} acctId={acctId} isDelete />
			)}
			<AcctBtn
				acct={acct}
				acctId={acctId}
				className="flex items-start md:items-center justify-between px-0 flex-1 py-2 h-auto w-full hover:px-2"
			>
				<div className="grid gap-1">
					<span className="text-sm text-muted-foreground">
						XXXX-{last4(acct.acctNumber)}
					</span>
					<Badge variant="secondary" className="text-xs rounded-sm">
						{acct.bank}
					</Badge>
				</div>

				<div className="flex items-center gap-1">
					<Amount amount={acct.currValue} className="text-sm" />
					<ChevronRight className="text-muted-foreground" />
				</div>
			</AcctBtn>
		</div>
	);
}
