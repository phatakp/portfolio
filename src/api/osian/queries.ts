import { queryOptions } from "@tanstack/react-query";
import type { PaymentResponse, PaymentSource, PaymentType } from "@/types";
import { getPayments, getSchedule } from "./osian.functions";

export const apiQueries = {
	payments: {
		all: () =>
			queryOptions({
				queryKey: ["payments"] as const,
				queryFn: getPayments,
				staleTime: 1000 * 60 * 60 * 24,
			}),
		filtered: (
			data: PaymentResponse[],
			type: PaymentType | undefined,
			source: PaymentSource | undefined,
		) =>
			queryOptions({
				queryKey: ["payments", "filtered", data, type, source] as const,
				queryFn: () => {
					return data
						.filter((r) =>
							type && type !== "all"
								? r.record.type.toLowerCase() === type.toLowerCase()
								: r,
						)
						.filter((r) =>
							source && source !== "all"
								? r.record.source.toLowerCase() === source.toLowerCase()
								: r,
						)
						.sort((a, b) => (a.record.date > b.record.date ? -1 : 1));
				},
				staleTime: 1000 * 60 * 60 * 24,
			}),
	},
	schedule: {
		all: () =>
			queryOptions({
				queryKey: ["schedule"] as const,
				queryFn: getSchedule,
				staleTime: 1000 * 60 * 60 * 24,
			}),
	},
};
