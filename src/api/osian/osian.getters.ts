import { useSuspenseQuery } from "@tanstack/react-query";
import { apiQueries } from "./queries";

export const usePayments = () => useSuspenseQuery(apiQueries.payments.all());

export const useSchedule = () => useSuspenseQuery(apiQueries.schedule.all());
