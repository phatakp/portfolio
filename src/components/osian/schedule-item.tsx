import { useUser } from "@clerk/tanstack-react-start";
import { useState } from "react";
import { useUpdateSchedule } from "@/api/osian/osian.mutations";
import { Amount } from "@/components/shared/amount";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Schedule } from "@/types";
import { Checkbox } from "../ui/checkbox";
import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";

type Props = {
	id: number;
	schedule: Schedule;
	isLastCompleted: boolean;
};
export function ScheduleItem({ id, schedule, isLastCompleted }: Props) {
	const [checked, setChecked] = useState(
		schedule.completed.toLowerCase() === "yes",
	);
	const { mutate: updateSchedule } = useUpdateSchedule();
	const { user, isLoaded, isSignedIn } = useUser();
	if (!isLoaded) return <Skeleton className="h-40 w-80 m-auto" />;
	if (!isSignedIn || !user.id) return;

	return (
		<TableRow
			className={cn(
				"text-muted-foreground hover:text-secondary-foreground group",
				isLastCompleted && "bg-success text-success-foreground",
			)}
		>
			<TableCell className="w-30 md:w-full">
				<div className="flex flex-col gap-1">
					<span className=" text-sm truncate text-left w-30 md:w-full">
						{schedule.description}
					</span>
					<Badge
						variant={"secondary"}
						className="text-xs text-muted-foreground rounded-md"
					>
						Remaining:{" "}
						<Amount amount={schedule.remaining} className="text-xs" />
					</Badge>
				</div>
			</TableCell>

			<TableCell className="hidden md:table-cell text-right">
				{schedule.duePercent * 100}%
			</TableCell>

			<TableCell className="hidden md:table-cell text-right">
				<Amount
					amount={schedule.principalDue}
					className="text-sm"
					iconClass={cn(
						isLastCompleted &&
							"text-success-foreground group-hover:text-muted-foreground",
					)}
				/>
			</TableCell>

			<TableCell className="hidden md:table-cell text-right">
				<Amount
					amount={schedule.gstDue}
					className="text-sm"
					iconClass={cn(
						isLastCompleted &&
							"text-success-foreground group-hover:text-muted-foreground",
					)}
				/>
			</TableCell>

			<TableCell className="text-right">
				<Amount
					amount={schedule.totalDue}
					className="text-sm"
					iconClass={cn(
						isLastCompleted &&
							"text-success-foreground group-hover:text-muted-foreground",
					)}
				/>
			</TableCell>

			<TableCell className="hidden md:table-cell text-right">
				<Amount
					amount={schedule.principalPaid}
					className="text-sm "
					iconClass={cn(
						isLastCompleted &&
							"text-success-foreground group-hover:text-muted-foreground",
					)}
				/>
			</TableCell>

			<TableCell className="hidden md:table-cell text-right">
				<Amount
					amount={schedule.gstPaid}
					className="text-sm "
					iconClass={cn(
						isLastCompleted &&
							"text-success-foreground group-hover:text-muted-foreground",
					)}
				/>
			</TableCell>

			<TableCell className="hidden md:table-cell text-right">
				<Amount
					amount={schedule.totalPaid}
					className="text-sm "
					iconClass={cn(
						isLastCompleted &&
							"text-success-foreground group-hover:text-muted-foreground",
					)}
				/>
			</TableCell>

			<TableCell>
				<Checkbox
					checked={checked}
					onCheckedChange={() => {
						updateSchedule({
							data: {
								...schedule,
								completed: checked ? "No" : "Yes",
								userId: user.id,
								rowNumber: id,
							},
						});
						setChecked((prev) => !prev);
					}}
				/>
			</TableCell>
		</TableRow>
	);
}
