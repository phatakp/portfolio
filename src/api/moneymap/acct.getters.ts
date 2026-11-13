import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import type { AccountType, InvResponse, InvType } from "@/types";
import { apiQueries } from "./queries";

export const useCurrUserAccounts = (userId: string) =>
	useQuery(apiQueries.account.userAccts(userId));

export const useGetBankOptions = (acctType: AccountType) =>
	useQuery(apiQueries.account.bankOptions(acctType));

export const useGetStats = (
	data: InvResponse[],
	type: "all" | "stocks" | "funds",
) => useSuspenseQuery(apiQueries.investment.userStats(data, type));

export const useGetFilteredInvestments = (
	data: InvResponse[],
	type: InvType,
	broker: string | undefined,
	category: string | undefined,
) =>
	useSuspenseQuery(
		apiQueries.investment.filteredInvestments(data, type, broker, category),
	);

export const useGetBrokerOptions = (data: InvResponse[]) =>
	useSuspenseQuery(apiQueries.investment.brokerOptions(data));

export const useGetCategoryOptions = (data: InvResponse[]) =>
	useSuspenseQuery(apiQueries.investment.categoryOptions(data));
