import { useSchedule } from "@/api/osian/osian.getters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ScheduleItem } from "./schedule-item";

export function Schedule() {
	const { data: resp } = useSchedule();
	const completed = resp?.records.findLastIndex(
		(rec) => rec.record.completed.toLowerCase() === "yes",
	);

	return (
		<div className="flex flex-col gap-6">
			<Card className="p-0 w-[calc(100vw-2rem)] md:w-full">
				<CardHeader className="gradient py-4 rounded-t-md">
					<CardTitle className="text-base md:text-xl tracking-wide capitalize text-muted-foreground">
						Payment Schedule
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-6 pb-2">
						{resp?.records?.map(({ rowNumber, record }, i) => (
							<ScheduleItem
								key={rowNumber}
								id={rowNumber}
								schedule={record}
								isLastCompleted={completed === i}
							/>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
