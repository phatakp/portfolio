import { ChevronRight } from "lucide-react";
import { Amount } from "@/components/shared/amount";
import { buttonVariants } from "@/components/ui/button";

import { capitalise, cn, last4 } from "@/lib/utils";
import type { Account } from "@/types";
import { AcctBtn } from "./acct-btn";

type Props = {
	acctId: number;
	acct: Account;
	isOdd: boolean;
	showBy: string;
};
export function AcctListItem({ acctId, acct, isOdd, showBy }: Props) {
	return (
		<AcctBtn
			acct={acct}
			acctId={acctId}
			className={cn(
				"text-left",
				buttonVariants({ variant: isOdd ? "outline" : "ghost" }),
				"justify-between w-full h-auto rounded-none py-1",
			)}
		>
			<span className="text-xs md:text-sm text-muted-foreground">
				{capitalise(
					showBy === "type" ? acct.bank : acct.acctType.toLowerCase(),
				)}
				-XXXX-{last4(acct.acctNumber)}
			</span>

			<div className="flex items-center gap-2">
				<Amount
					amount={acct.currValue}
					className="text-sm md:text-lg"
					shorten
				/>
				<ChevronRight className="text-muted-foreground" />
			</div>
		</AcctBtn>
	);
}
