import { useAppStore } from '../stores/useAppStore'

export default function ActivityLog() {
  const { activityLog } = useAppStore()

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getTypeColor = (type: 'add' | 'edit' | 'delete'): string => {
    switch (type) {
      case 'add':
        return 'text-green-600 dark:text-green-400'
      case 'edit':
        return 'text-blue-600 dark:text-blue-400'
      case 'delete':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  if (activityLog.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Activity Log</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">No activity yet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Activity Log</h2>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activityLog.map((entry, index) => (
          <div
            key={`${entry.timestamp}-${index}`}
            className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <div className={`w-2 h-2 rounded-full mt-2 ${entry.type === 'add' ? 'bg-green-500' : entry.type === 'edit' ? 'bg-blue-500' : 'bg-red-500'}`}></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-bold text-xs ${getTypeColor(entry.type)}`}>
                  {entry.type.toUpperCase()}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-xs">{formatTime(entry.timestamp)}</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{entry.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

