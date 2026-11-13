import { ChevronRight } from "lucide-react";
import { Amount } from "@/components/shared/amount";
import { Badge } from "@/components/ui/badge";
import type { Investment } from "@/types";
import { Chevron } from "./chevron";
import { InvBtn } from "./inv-btn";

type Props = {
	invId: number;
	inv: Investment;
};
export function InvListItem({ invId, inv }: Props) {
	return (
		<div className="flex items-center gap-2 w-full">
			<InvBtn inv={inv} invId={invId} isDelete />
			<InvBtn
				inv={inv}
				invId={invId}
				className="flex items-start md:items-center justify-between px-0 flex-1 py-2 h-auto w-full hover:px-2"
			>
				<div className="flex flex-col flex-1 gap-1">
					<span className=" text-xs md:text-sm truncate w-30 text-left md:w-full">
						{inv.fundName}
					</span>

					<div className="flex items-center gap-2">
						<Badge
							variant={"secondary"}
							className="text-xs text-muted-foreground rounded-md"
						>
							Invested:
							<Amount
								amount={inv.investedAmt}
								className="text-xs"
								iconClass="text-muted size-3"
								shorten
							/>
						</Badge>

						<Chevron gains={inv.gainsOrLoss} currValue={inv.currValue} />
					</div>
				</div>

				<div className="flex items-center gap-1">
					<Amount amount={inv.currValue} className="text-base" shorten />
					<ChevronRight className="text-muted-foreground" />
				</div>
			</InvBtn>
		</div>
	);
}
