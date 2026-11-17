import { queryOptions } from "@tanstack/react-query";
import { BANK, INVESTMENT_TYPE } from "@/lib/constants";
import { capitalise } from "@/lib/utils";
import type { AccountType, AcctResponse, InvResponse, InvType } from "@/types";
import { getUserAccounts, getUserInvestments } from "./acct.functions";

export const apiQueries = {
	account: {
		all: () =>
			queryOptions({
				queryKey: ["accts"] as const,
				queryFn: getUserAccounts,
				staleTime: Infinity,
			}),
		userAccounts: (data: AcctResponse[], userId: string) =>
			queryOptions({
				queryKey: [
					...apiQueries.account.all().queryKey,
					"user",
					data,
					userId,
				] as const,
				queryFn: () => {
					return data.filter((r) =>
						userId === "all" ? r : r.record.userId === userId,
					);
				},
				staleTime: 1000 * 60 * 60 * 24,
			}),

		bankOptions: (type: AccountType, isNew?: boolean) =>
			queryOptions({
				queryKey: [
					...apiQueries.account.all().queryKey,
					"bank-options",
					type,
					isNew,
				] as const,
				queryFn: () =>
					BANK[type as keyof typeof BANK]
						?.filter((b) => (isNew ? b.toLowerCase() !== "cash" : b))
						.map((b: string) => ({
							label: b,
							value: b,
						})),
				staleTime: 1000 * 60 * 60 * 24,
			}),
	},
	investment: {
		all: () =>
			queryOptions({
				queryKey: ["investments"] as const,
				queryFn: getUserInvestments,
				staleTime: Infinity,
			}),
		userInvestments: (data: InvResponse[], userId: string) =>
			queryOptions({
				queryKey: [
					...apiQueries.investment.all().queryKey,
					"user",
					data,
					userId,
				] as const,
				queryFn: () => {
					return data
						.filter((r) => (userId === "all" ? r : r.record.userId === userId))
						.sort((a, b) => (a.record.fundName > b.record.fundName ? 1 : -1));
				},
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
					...apiQueries.investment.all().queryKey,
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
					...apiQueries.investment.all().queryKey,
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
					...apiQueries.investment.all().queryKey,
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
					...apiQueries.investment.all().queryKey,
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
