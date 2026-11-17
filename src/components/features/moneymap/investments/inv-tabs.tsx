import {
	Tabs,
	TabsContent,
	TabsContents,
	TabsList,
	TabsTrigger,
} from "@/components/animate-ui/components/radix/tabs";
import { INVESTMENT_TYPE, INVESTMENT_TYPE_OPTIONS } from "@/lib/constants";
import { capitalise } from "@/lib/utils";
import { InvList } from "./inv-list";

export function InvTabs() {
	return (
		<div className="w-full ">
			<Tabs defaultValue={INVESTMENT_TYPE.MUTUAL_FUND}>
				<TabsList>
					{INVESTMENT_TYPE_OPTIONS.map((t) => (
						<TabsTrigger key={t} value={t}>
							{capitalise(t)}
						</TabsTrigger>
					))}
				</TabsList>
				<TabsContents className="py-6">
					{INVESTMENT_TYPE_OPTIONS.map((t) => (
						<TabsContent key={t} value={t} className="flex flex-col gap-6">
							<InvList type={t} />
						</TabsContent>
					))}
				</TabsContents>
			</Tabs>
		</div>
	);
}
