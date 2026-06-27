import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const queryKeys = {
  customers: ['customers'] as const,
  customer: (id: string) => ['customers', id] as const,
  loan: (id: string) => ['loans', id] as const,
  dashboard: ['dashboard'] as const,
  timeline: (limit?: number) => ['timeline', { limit }] as const,
  nextPayments: (limit?: number) => ['nextPayments', { limit }] as const,
};
