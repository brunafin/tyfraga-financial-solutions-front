import { useEffect } from 'react';
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import { useLoader } from '../contexts/Loader/useLoader';
import { CustomerService } from '../services/customer';
import { DashboardService } from '../services/dashboard';
import { LoanService } from '../services/loan';
import { queryKeys } from '../lib/queryClient';
import type { ICustomerListItem } from '../pages/Customers/types';
import type { ITimelineItem } from '../pages/Dashboard';

export interface ICustomerDetail {
  uuid: string;
  name: string;
  phone: string;
  total_loans: number;
  amount_loaned: number;
  amount_received: number;
  amount_pending_receive: number;
  amount_interest_loaned: number;
  average_tax: number;
  profit: number;
  profit_pending: number;
  loans: {
    uuid: string;
    tax: number;
    loan_value: number;
    loan_date: string;
    status: 'paid' | 'pending' | 'overdue';
  }[];
}

export interface IDashboardInfo {
  totalCustomers: number;
  totalLoans: number;
  totalAmountLoaned: number;
  totalAmountLoanedWithInterest: number;
  totalReceived: number;
  totalPending: number;
  interestReceived: number;
  interestPending: number;
  averageTax: number;
  customersOverdue: ITimelineItem[];
}

export interface ILoanDetail {
  uuid: string;
  originalValue: number;
  loanValue: number;
  loanDate: string;
  tax: number;
  payments: {
    id: number;
    installmentRef: number;
    installmentValue: number;
    dueDate: string;
    payedValue: number;
    payedDate: string | null;
    observation: string | null;
  }[];
}

export function useQueryWithLoader<TData>(
  options: UseQueryOptions<TData>,
): UseQueryResult<TData> {
  const { showLoader, hideLoader } = useLoader();
  const query = useQuery(options);

  useEffect(() => {
    if (!query.isLoading) {
      return;
    }

    showLoader();
    return () => hideLoader();
  }, [query.isLoading, showLoader, hideLoader]);

  return query;
}

export function useCustomers() {
  return useQueryWithLoader<ICustomerListItem[]>({
    queryKey: queryKeys.customers,
    queryFn: async ({ signal }) => {
      const data = await CustomerService.getCustomers(signal);
      return data.customers as ICustomerListItem[];
    },
  });
}

export function useCustomer(id: string) {
  return useQueryWithLoader<ICustomerDetail>({
    queryKey: queryKeys.customer(id),
    queryFn: ({ signal }) => CustomerService.getCustomerById(id, signal),
    enabled: !!id,
  });
}

export function useLoan(id: string) {
  return useQueryWithLoader<ILoanDetail>({
    queryKey: queryKeys.loan(id),
    queryFn: ({ signal }) => LoanService.getLoanById(id, signal),
    enabled: !!id,
  });
}

export function useDashboard() {
  return useQueryWithLoader<IDashboardInfo>({
    queryKey: queryKeys.dashboard,
    queryFn: ({ signal }) => DashboardService.getInfo(signal),
  });
}

export function useTimeline(limit?: number) {
  return useQueryWithLoader<ITimelineItem[]>({
    queryKey: queryKeys.timeline(limit),
    queryFn: async ({ signal }) => {
      const data = await DashboardService.getTimeline({ limit }, signal);
      return data.timeline as ITimelineItem[];
    },
  });
}

export function useNextPayments(limit?: number) {
  return useQueryWithLoader<ITimelineItem[]>({
    queryKey: queryKeys.nextPayments(limit),
    queryFn: async ({ signal }) => {
      const data = await DashboardService.getNextPayments({ limit }, signal);
      return data.timeline as ITimelineItem[];
    },
  });
}

export function useUpdateCustomer(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; phone: string }) =>
      CustomerService.updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers });
      queryClient.invalidateQueries({ queryKey: queryKeys.customer(id) });
    },
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CustomerService.createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useCreateLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: LoanService.createLoan,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      queryClient.invalidateQueries({
        queryKey: queryKeys.customer(variables.customer_id),
      });
      queryClient.invalidateQueries({ queryKey: ['timeline'] });
      queryClient.invalidateQueries({ queryKey: ['nextPayments'] });
    },
  });
}

export function usePayInstallment(loanId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: LoanService.checkPayDate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.loan(loanId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: ['timeline'] });
      queryClient.invalidateQueries({ queryKey: ['nextPayments'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

export function useDeleteLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: LoanService.deleteLoan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: ['timeline'] });
      queryClient.invalidateQueries({ queryKey: ['nextPayments'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}
