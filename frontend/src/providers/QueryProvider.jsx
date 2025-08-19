import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: how long data is considered fresh
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Cache time: how long data stays in cache after component unmounts
      cacheTime: 10 * 60 * 1000, // 10 minutes
      // Retry failed requests
      retry: 2,
      // Don't refetch on window focus by default
      refetchOnWindowFocus: false,
      // Don't refetch on reconnect by default
      refetchOnReconnect: true,
      // Keep data when query key changes
      keepPreviousData: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Query Client Provider Component
export const QueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Show React Query DevTools in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
};

export { queryClient };
export default QueryProvider;
