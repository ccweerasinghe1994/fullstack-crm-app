import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Balanced caching strategy for CRM application
        staleTime: 30_000, // 30 seconds - data is considered fresh
        gcTime: 5 * 60 * 1000, // 5 minutes - keep unused data in cache
        refetchOnWindowFocus: true, // Refetch when user returns to tab
        refetchOnMount: true, // Refetch on component mount if data is stale
        retry: 2, // Retry failed requests twice before showing error
        // Prevent unnecessary refetches on reconnect for better UX
        refetchOnReconnect: true,
      },
      mutations: {
        // Retry mutations once on network failure
        retry: 1,
      },
    },
  });
  return {
    queryClient,
  };
}

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode;
  queryClient: QueryClient;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
