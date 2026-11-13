import { queryOptions } from "@tanstack/react-query";
import { BANK, INVESTMENT_TYPE } from "@/lib/constants";
import { capitalise } from "@/lib/utils";
import type { AccountType, InvResponse, InvType } from "@/types";
import { getUserAccounts, getUserInvestments } from "./acct.functions";

export const apiQueries = {
	account: {
		all: () => ["accts"] as const,
		userAccts: (userId: string) =>
			queryOptions({
				queryKey: [...apiQueries.account.all(), userId] as const,
				queryFn: getUserAccounts,
				staleTime: 1000 * 60 * 60 * 24,
			}),
		bankOptions: (type: AccountType) =>
			queryOptions({
				queryKey: [...apiQueries.account.all(), "bank-options", type] as const,
				queryFn: () =>
					BANK[type as keyof typeof BANK]?.map((b: string) => ({
						label: b,
						value: b,
					})),
				staleTime: 1000 * 60 * 60 * 24,
			}),
	},
	investment: {
		all: () => ["investments"] as const,
		userInvestments: (userId: string) =>
			queryOptions({
				queryKey: [...apiQueries.investment.all(), userId] as const,
				queryFn: getUserInvestments,
				staleTime: 1000 * 60 * 60 * 24,
			}),
		filteredInvestments: (
			data: InvResponse[],
			type: InvType,
			broker: string | undefined,
			category: string | undefined,
		) =>
			queryOptions({
				queryKey: [
					...apiQueries.investment.all(),
					"filtered",
					data,
					type,
					broker,
					category,
				] as const,
				queryFn: () => {
					return data
						.filter((r) => r.record.invType === type)
						.filter((r) =>
							r.record.invType === INVESTMENT_TYPE.MUTUAL_FUND &&
							broker &&
							broker !== "all"
								? r.record.broker.toLowerCase() === broker.toLowerCase()
								: r,
						)
						.filter((r) =>
							r.record.invType === INVESTMENT_TYPE.MUTUAL_FUND &&
							category &&
							category !== "all"
								? r.record.category.toLowerCase() === category.toLowerCase()
								: r,
						)
						.sort((a, b) => (a.record.fundName > b.record.fundName ? 1 : -1));
				},
				staleTime: 1000 * 60 * 60 * 24,
			}),
		userStats: (data: InvResponse[], type: "all" | "stocks" | "funds") =>
			queryOptions({
				queryKey: [
					...apiQueries.investment.all(),
					"stats",
					data,
					type,
				] as const,
				queryFn: () => {
					if (type === "all") {
						const totalValue =
							data
								.filter((record) => Number.isFinite(record.record.currValue))
								.reduce((acc, record) => acc + record.record.currValue, 0) ?? 0;
						const totalGains =
							data
								.filter((record) => Number.isFinite(record.record.gainsOrLoss))
								.reduce((acc, record) => acc + record.record.gainsOrLoss, 0) ??
							0;
						return { value: totalValue, gains: totalGains };
					}

					if (type === "stocks") {
						const totalValue =
							data
								.filter(
									(record) =>
										record.record.invType === INVESTMENT_TYPE.EQUITY &&
										Number.isFinite(record.record.currValue),
								)
								.reduce((acc, record) => acc + record.record.currValue, 0) ?? 0;
						const totalGains =
							data
								.filter(
									(record) =>
										record.record.invType === INVESTMENT_TYPE.EQUITY &&
										Number.isFinite(record.record.gainsOrLoss),
								)
								.reduce((acc, record) => acc + record.record.gainsOrLoss, 0) ??
							0;
						return { value: totalValue, gains: totalGains };
					}
					if (type === "funds") {
						const totalValue =
							data
								.filter(
									(record) =>
										record.record.invType !== INVESTMENT_TYPE.EQUITY &&
										Number.isFinite(record.record.currValue),
								)
								.reduce((acc, record) => acc + record.record.currValue, 0) ?? 0;
						const totalGains =
							data
								.filter(
									(record) =>
										record.record.invType === INVESTMENT_TYPE.MUTUAL_FUND &&
										Number.isFinite(record.record.gainsOrLoss),
								)
								.reduce((acc, record) => acc + record.record.gainsOrLoss, 0) ??
							0;
						return { value: totalValue, gains: totalGains };
					}
				},
				staleTime: 1000 * 60 * 60 * 24,
			}),
		brokerOptions: (data: InvResponse[]) =>
			queryOptions({
				queryKey: [
					...apiQueries.investment.all(),
					"broker-options",
					data,
				] as const,
				queryFn: () => {
					const invByBroker = Object.groupBy(
						data.filter(
							(r) => r.record.invType === INVESTMENT_TYPE.MUTUAL_FUND,
						) ?? [],
						(a) => a.record.broker,
					);
					return Object.keys(invByBroker)
						.map((b) => ({
							label: capitalise(b),
							value: b,
						}))
						.concat({ label: "All", value: "all" });
				},

				staleTime: 1000 * 60 * 60 * 24,
			}),
		categoryOptions: (data: InvResponse[]) =>
			queryOptions({
				queryKey: [
					...apiQueries.investment.all(),
					"category-options",
					data,
				] as const,
				queryFn: () => {
					const invByCategory = Object.groupBy(
						data.filter(
							(r) => r.record.invType === INVESTMENT_TYPE.MUTUAL_FUND,
						) ?? [],
						(a) => a.record.category,
					);
					return Object.keys(invByCategory)
						.map((b) => ({
							label: capitalise(b),
							value: b,
						}))
						.concat({ label: "All", value: "all" });
				},

				staleTime: 1000 * 60 * 60 * 24,
			}),
	},
};
