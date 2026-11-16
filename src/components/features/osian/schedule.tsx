import { useSchedule } from "@/api/osian/osian.getters";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";
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
						{/* <Table>
							<TableHeader className="bg-secondary text-secondary-foreground">
								<TableRow>
									<TableHead className="title text-sm w-30 md:w-full">
										Description
									</TableHead>
									<TableHead className="title text-sm hidden md:table-cell text-right">
										Due %
									</TableHead>
									<TableHead className="title text-sm hidden md:table-cell text-right">
										Prin Due
									</TableHead>
									<TableHead className="title text-sm hidden md:table-cell text-right">
										GST Due
									</TableHead>
									<TableHead className="title text-sm text-right">
										Total Due
									</TableHead>
									<TableHead className="title text-sm hidden md:table-cell text-right">
										Prin Paid
									</TableHead>
									<TableHead className="title text-sm hidden md:table-cell text-right">
										GST Paid
									</TableHead>
									<TableHead className="title text-sm hidden md:table-cell text-right">
										Total Paid
									</TableHead>
									<TableHead></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody> */}
						{resp?.records?.map(({ rowNumber, record }, i) => (
							<ScheduleItem
								key={rowNumber}
								id={rowNumber}
								schedule={record}
								isLastCompleted={completed === i}
							/>
						))}
						{/* </TableBody>
						</Table> */}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
