import { useSchedule } from "@/api/osian/osian.getters";
import { Amount } from "@/components/shared/amount";
import { Badge } from "@/components/ui/badge";

export function Remaining() {
	const { data: resp } = useSchedule();
	const completed = resp?.records.findLastIndex(
		(rec) => rec.record.completed.toLowerCase() === "yes",
	);

	return (
		<Badge variant={"destructive"} className="w-full md:w-fit">
			Remaining to be paid:
			<Amount
				amount={resp?.records[completed ?? 0].record.remaining ?? 0}
				className="text-base"
				iconClass="text-destructive-foreground"
				shorten
			/>
		</Badge>
	);
}
