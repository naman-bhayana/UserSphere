import { useState, useRef } from 'react'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider, HydrationBoundary } from '@tanstack/react-query'
import Layout from '../src/components/Layout'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: 1,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      },
    },
  }))

  const hasHydrated = useRef(false)
  const initialDehydratedState = useRef(pageProps.dehydratedState)

  let dehydratedStateToUse: typeof pageProps.dehydratedState = undefined

  if (!hasHydrated.current && initialDehydratedState.current) {
    const existingData = queryClient.getQueryData(['users'])
    if (!existingData) {
      dehydratedStateToUse = initialDehydratedState.current
    }
    hasHydrated.current = true
  }

  return (
    <QueryClientProvider client={queryClient}>
      {dehydratedStateToUse ? (
        <HydrationBoundary state={dehydratedStateToUse}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </HydrationBoundary>
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </QueryClientProvider>
  )
}

