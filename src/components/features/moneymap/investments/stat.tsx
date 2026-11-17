import { Amount } from "@/components/shared/amount";
import { Chevron } from "./chevron";

type Props = {
	title: string;
	currValue: number;
	gains: number;
};
export function Stat({ title, currValue, gains }: Props) {
	return (
		<div className="grid gap-1 w-full">
			<h3 className="text-xs md:text-sm font-medium text-muted-foreground w-full whitespace-nowrap">
				{title}
			</h3>
			<div className="flex flex-col md:flex-row md:items-center gap-2">
				<Amount
					amount={currValue}
					className="text-lg md:text-2xl"
					shorten
					containerClass="justify-start"
				/>
				<Chevron gains={gains} currValue={currValue} />
			</div>
		</div>
	);
}
