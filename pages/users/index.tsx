import { QueryClient, dehydrate } from '@tanstack/react-query'
import type { GetServerSideProps } from 'next'
import { fetchUsers } from '../../src/lib/api/users'
import UsersContainer from '../../src/components/UsersContainer'

export default function UsersPage() {
  return <UsersContainer />
}

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}
