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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activity Log</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">No activity yet</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activity Log</h2>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {activityLog.map((entry, index) => (
          <div
            key={`${entry.timestamp}-${index}`}
            className="flex items-start gap-2 text-sm border-b border-gray-200 dark:border-gray-700 pb-2 last:border-0"
          >
            <span className={`font-medium ${getTypeColor(entry.type)}`}>
              {entry.type.toUpperCase()}
            </span>
            <span className="text-gray-700 dark:text-gray-300 flex-1">{entry.message}</span>
            <span className="text-gray-500 dark:text-gray-400 text-xs">{formatTime(entry.timestamp)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

