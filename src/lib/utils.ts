import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(date: Date | undefined) {
	if (!date) {
		return "";
	}
	return date.toLocaleDateString("en-US", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}

export function isValidDate(date: Date | undefined) {
	if (!date) {
		return false;
	}
	return !Number.isNaN(date.getTime());
}

export function amountFormatter(val: number, decimalPlaces: number = 0) {
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		currencyDisplay: "code",
		minimumFractionDigits: decimalPlaces,
		maximumFractionDigits: decimalPlaces,
	})
		.formatToParts(val)
		.map((p) => (p.type !== "literal" && p.type !== "currency" ? p.value : ""))
		.join("");
}

export function amountShortener(val: number) {
	const sign = val < 0 ? "-" : "";
	if (Math.abs(val) < 1000) return `${sign}${Math.abs(val)}`;
	if (Math.abs(val) < 100_000)
		return `${sign}${(Math.abs(val) / 1000).toFixed(2)}K`;
	if (Math.abs(val) < 10_000_000)
		return `${sign}${(Math.abs(val) / 100_000).toFixed(2)}L`;
	return `${sign}${(Math.abs(val) / 10_000_000).toFixed(2)}Cr`;
}

export const capitalise = (s: string) => {
	if (!s) return s;
	return s
		.replace("_", " ")
		.split(" ")
		.map((word) =>
			[
				"ICICI",
				"SBI",
				"HDFC",
				"ELSS",
				"ULIP",
				"NPS",
				"EPF",
				"GST",
				"TDS",
				"EMI",
			].includes(word)
				? word
				: word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
		)
		.join(" ");
};

export const formatAcctNumber = (str: string) => {
	// 1. Remove all existing spaces to avoid compounding issues
	const rawValue = str.replace(/\s+/g, "");

	// 2. Break the string into chunks of 4 characters and join them with a space
	return (
		rawValue
			.split("")
			.reverse()
			.join("")
			.match(/.{1,4}/g)
			?.join(" ")
			.split("")
			.reverse()
			.join("") ?? ""
	);
};

export const formatAcctName = (s: string) => {
	if (s.length === 0) return s;
	return s
		.split("_")
		.reverse()
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};

export const last4 = (str: string) => {
	return str.replace(" ", "").slice(-4);
};
