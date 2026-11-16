import {
	Tabs,
	TabsContent,
	TabsContents,
	TabsList,
	TabsTrigger,
} from "@/components/animate-ui/components/radix/tabs";
import { OSIAN, OSIAN_OPTIONS } from "@/lib/constants";
import { capitalise } from "@/lib/utils";
import { PaymentList } from "./payment-list";
import { Schedule } from "./schedule";

export function OsianTabs() {
	return (
		<div className="w-full ">
			<Tabs defaultValue={OSIAN.PAYMENTS}>
				<TabsList>
					{OSIAN_OPTIONS.map((t) => (
						<TabsTrigger key={t} value={t}>
							{capitalise(t)}
						</TabsTrigger>
					))}
				</TabsList>
				<TabsContents className="py-6">
					{OSIAN_OPTIONS.map((t) => (
						<TabsContent key={t} value={t} className="flex flex-col gap-6">
							{t === OSIAN.PAYMENTS ? <PaymentList /> : <Schedule />}
						</TabsContent>
					))}
				</TabsContents>
			</Tabs>
		</div>
	);
}
