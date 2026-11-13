import { Amount } from "@/components/shared/amount";

type Props = {
	title: string;
	total: number;
};
export function Stat({ title, total }: Props) {
	return (
		<div className="grid gap-1 w-full">
			<h3 className="text-xs md:text-sm font-medium text-muted-foreground w-full whitespace-nowrap">
				{title}
			</h3>
			<div className="flex flex-col md:flex-row md:items-center gap-2">
				<Amount
					amount={total}
					className="text-lg md:text-2xl"
					shorten
					containerClass="justify-start"
				/>
			</div>
		</div>
	);
}
