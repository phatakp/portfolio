import { useUser } from "@clerk/tanstack-react-start";
import { useState } from "react";
import { useUpdateSchedule } from "@/api/osian/osian.mutations";
import { Amount } from "@/components/shared/amount";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Schedule } from "@/types";

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
		<Card className="p-0">
			<CardHeader
				className={cn(
					"py-2 rounded-t-md",
					isLastCompleted ? "bg-success text-success-foreground" : "gradient",
				)}
			>
				<CardTitle className="text-sm md:text-base">
					Due: {schedule.duePercent * 100}%
				</CardTitle>
				<CardDescription
					className={cn(
						"text-xs md:text-sm",
						isLastCompleted && "text-success-foreground",
					)}
				>
					{schedule.description}
				</CardDescription>
				<CardAction>
					<span className="text-sm pr-2">Paid</span>
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
				</CardAction>
			</CardHeader>
			<CardContent className="p-0 pb-4">
				<Table>
					<TableHeader className="bg-secondary text-secondary-foreground">
						<TableRow>
							<TableHead>Item</TableHead>
							<TableHead className="text-right">Amount</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell className="text-xs md:text-sm">
								Principal Due
							</TableCell>
							<TableCell className="text-right">
								<Amount
									amount={schedule.principalDue}
									className="text-xs md:text-sm"
								/>
							</TableCell>
						</TableRow>

						<TableRow>
							<TableCell className="text-xs md:text-sm">GST Due</TableCell>
							<TableCell className="text-right">
								<Amount
									amount={schedule.gstDue}
									className="text-xs md:text-sm"
								/>
							</TableCell>
						</TableRow>

						<TableRow className="bg-muted text-muted-foreground">
							<TableCell className="text-xs md:text-sm">Total Due</TableCell>
							<TableCell className="text-right">
								<Amount
									amount={schedule.totalDue}
									className="text-xs md:text-sm"
								/>
							</TableCell>
						</TableRow>

						<TableRow>
							<TableCell className="text-xs md:text-sm">
								Principal Paid (Cumulative)
							</TableCell>
							<TableCell className="text-right">
								<Amount
									amount={schedule.principalPaid}
									className="text-xs md:text-sm"
								/>
							</TableCell>
						</TableRow>

						<TableRow>
							<TableCell className="text-xs md:text-sm">
								GST Paid (Cumulative)
							</TableCell>
							<TableCell className="text-right">
								<Amount
									amount={schedule.gstPaid}
									className="text-xs md:text-sm"
								/>
							</TableCell>
						</TableRow>

						<TableRow className="bg-muted text-muted-foreground">
							<TableCell className="text-xs md:text-sm">
								Total Paid (Cumulative)
							</TableCell>
							<TableCell className="text-right">
								<Amount
									amount={schedule.totalPaid}
									className="text-xs md:text-sm"
								/>
							</TableCell>
						</TableRow>

						<TableRow className="text-destructive">
							<TableCell className="text-xs md:text-sm">
								Remaining Due{" "}
							</TableCell>
							<TableCell className="text-right">
								<Amount
									amount={schedule.remaining}
									className="text-xs md:text-sm"
								/>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
	// return (
	// 	<TableRow
	// 		className={cn(
	// 			"text-muted-foreground hover:text-secondary-foreground group",
	// 			isLastCompleted && "bg-success text-success-foreground",
	// 		)}
	// 	>
	// 		<TableCell className="w-30 md:w-full">
	// 			<div className="flex flex-col gap-1">
	// 				<span className=" text-sm truncate text-left w-30 md:w-full">
	// 					{schedule.description}
	// 				</span>
	// 				<Badge
	// 					variant={"secondary"}
	// 					className="text-xs text-muted-foreground rounded-md"
	// 				>
	// 					Remaining:{" "}
	// 					<Amount amount={schedule.remaining} className="text-xs" />
	// 				</Badge>
	// 			</div>
	// 		</TableCell>

	// 		<TableCell className="hidden md:table-cell text-right">
	// 			{schedule.duePercent * 100}%
	// 		</TableCell>

	// 		<TableCell className="hidden md:table-cell text-right">
	// 			<Amount
	// 				amount={schedule.principalDue}
	// 				className="text-sm"
	// 				iconClass={cn(
	// 					isLastCompleted &&
	// 						"text-success-foreground group-hover:text-muted-foreground",
	// 				)}
	// 			/>
	// 		</TableCell>

	// 		<TableCell className="hidden md:table-cell text-right">
	// 			<Amount
	// 				amount={schedule.gstDue}
	// 				className="text-sm"
	// 				iconClass={cn(
	// 					isLastCompleted &&
	// 						"text-success-foreground group-hover:text-muted-foreground",
	// 				)}
	// 			/>
	// 		</TableCell>

	// 		<TableCell className="text-right">
	// 			<Amount
	// 				amount={schedule.totalDue}
	// 				className="text-sm"
	// 				iconClass={cn(
	// 					isLastCompleted &&
	// 						"text-success-foreground group-hover:text-muted-foreground",
	// 				)}
	// 			/>
	// 		</TableCell>

	// 		<TableCell className="hidden md:table-cell text-right">
	// 			<Amount
	// 				amount={schedule.principalPaid}
	// 				className="text-sm "
	// 				iconClass={cn(
	// 					isLastCompleted &&
	// 						"text-success-foreground group-hover:text-muted-foreground",
	// 				)}
	// 			/>
	// 		</TableCell>

	// 		<TableCell className="hidden md:table-cell text-right">
	// 			<Amount
	// 				amount={schedule.gstPaid}
	// 				className="text-sm "
	// 				iconClass={cn(
	// 					isLastCompleted &&
	// 						"text-success-foreground group-hover:text-muted-foreground",
	// 				)}
	// 			/>
	// 		</TableCell>

	// 		<TableCell className="hidden md:table-cell text-right">
	// 			<Amount
	// 				amount={schedule.totalPaid}
	// 				className="text-sm "
	// 				iconClass={cn(
	// 					isLastCompleted &&
	// 						"text-success-foreground group-hover:text-muted-foreground",
	// 				)}
	// 			/>
	// 		</TableCell>

	// 		<TableCell>
	// 			<Checkbox
	// 				checked={checked}
	// 				onCheckedChange={() => {
	// 					updateSchedule({
	// 						data: {
	// 							...schedule,
	// 							completed: checked ? "No" : "Yes",
	// 							userId: user.id,
	// 							rowNumber: id,
	// 						},
	// 					});
	// 					setChecked((prev) => !prev);
	// 				}}
	// 			/>
	// 		</TableCell>
	// 	</TableRow>
	// );
}
