export default function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, index) => (
        <tr key={index} className="animate-pulse">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex gap-3">
              <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </td>
        </tr>
      ))}
    </>
  )
}

