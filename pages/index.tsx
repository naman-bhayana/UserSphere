import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push('/users')
  }, [router])

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-gray-600 dark:text-gray-400">Redirecting...</p>
    </div>
  )
}

