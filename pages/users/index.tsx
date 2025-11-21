import { QueryClient, dehydrate } from '@tanstack/react-query'
import type { GetServerSideProps } from 'next'
import { fetchUsers } from '../../src/lib/api/users'
import UsersContainer from '../../src/components/UsersContainer'

export default function UsersPage() {
  return <UsersContainer />
}

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      },
    },
  })

  await queryClient.prefetchQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000,
  })

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}
