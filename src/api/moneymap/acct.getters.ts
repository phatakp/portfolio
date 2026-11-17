import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import type { AccountType, AcctResponse, InvResponse, InvType } from "@/types";
import { apiQueries } from "./queries";

export const useGetAccounts = () => useSuspenseQuery(apiQueries.account.all());

export const useGetInvestments = () =>
	useSuspenseQuery(apiQueries.investment.all());

export const useGetUserAccounts = (data: AcctResponse[], userId: string) =>
	useSuspenseQuery(apiQueries.account.userAccounts(data, userId));

export const useGetUserInvestments = (data: InvResponse[], userId: string) =>
	useSuspenseQuery(apiQueries.investment.userInvestments(data, userId));

export const useGetBankOptions = (acctType: AccountType, isNew?: boolean) =>
	useQuery(apiQueries.account.bankOptions(acctType, isNew));

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
