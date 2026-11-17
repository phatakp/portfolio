import { Image } from "@unpic/react";
import { APP } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { App } from "@/types";

export function SiteLogo({
	className,
	app,
}: {
	className?: string;
	app?: App | null;
}) {
	return (
		<div className={cn("w-14 md:w-20 h-full", className)}>
			{app === APP.MONEYMAP && (
				<Image
					src="https://res.cloudinary.com/dgpvaaxwq/image/upload/v1780298270/logo_yggcsx.png"
					alt="Logo"
					className="w-full h-full object-contain"
					layout="fullWidth"
				/>
			)}
			{app === APP.OSIAN && (
				<Image
					src="https://osian-almanova.com/images/logo.png"
					alt="Logo"
					className="w-full h-full object-contain"
					layout="fullWidth"
				/>
			)}
			{app === APP.KPEVENTS && (
				<div className="flex items-center">
					<Image src={"/calendar.png"} width={35} height={35} alt="logo-1" />
					<Image
						src={"/logo.png"}
						width={100}
						height={50}
						alt="logo-2"
						className="-ml-1"
					/>
				</div>
			)}
		</div>
	);
}
