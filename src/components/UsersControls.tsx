import * as Select from '@radix-ui/react-select'

interface UsersControlsProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  isSearching?: boolean
  selectedCompany: string
  companyOptions: string[]
  onCompanyChange: (value: string) => void
  onCompanyClear: () => void
  emailSortOrder: 'asc' | 'desc' | null
  onEmailSortToggle: () => void
  onAddClick: () => void
  isMutating?: boolean
}

export default function UsersControls({
  searchTerm,
  onSearchChange,
  isSearching = false,
  selectedCompany,
  companyOptions,
  onCompanyChange,
  onCompanyClear,
  emailSortOrder,
  onEmailSortToggle,
  onAddClick,
  isMutating = false,
}: UsersControlsProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
            Users
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage your user database</p>
        </div>
        <button
          onClick={onAddClick}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transition-all duration-200 font-medium flex items-center gap-2"
          aria-label="Add new user"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add User
        </button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <label htmlFor="search" className="sr-only">
            Search by name
          </label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            id="search"
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
          />
          {isSearching && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center" role="status" aria-label="Searching">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <Select.Root value={selectedCompany} onValueChange={onCompanyChange}>
            <Select.Trigger
              className="inline-flex items-center justify-between px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-w-[180px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm transition-all duration-200 font-medium"
              aria-label="Filter by company"
            >
              <Select.Value placeholder="All Companies">
                {selectedCompany === 'all' ? 'All Companies' : selectedCompany}
              </Select.Value>
              <Select.Icon className="text-gray-500 dark:text-gray-400">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path
                    d="M4 6H11L7.5 10.5L4 6Z"
                    fill="currentColor"
                  />
                </svg>
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                <Select.Viewport className="p-2">
                  <Select.Item
                    value="all"
                    className="relative px-4 py-2.5 rounded-lg text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700 focus:bg-blue-50 dark:focus:bg-gray-700 focus:outline-none cursor-pointer transition-colors duration-200"
                  >
                    <Select.ItemText className="font-medium">All Companies</Select.ItemText>
                  </Select.Item>
                  {companyOptions.map((company) => (
                    <Select.Item
                      key={company}
                      value={company}
                      className="relative px-4 py-2.5 rounded-lg text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700 focus:bg-blue-50 dark:focus:bg-gray-700 focus:outline-none cursor-pointer transition-colors duration-200"
                    >
                      <Select.ItemText className="font-medium">{company}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>

          <button
            onClick={onEmailSortToggle}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm transition-all duration-200 font-medium flex items-center gap-2"
            aria-label={`Sort by email ${emailSortOrder === 'asc' ? 'ascending' : emailSortOrder === 'desc' ? 'descending' : 'none'}`}
            aria-pressed={emailSortOrder !== null}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
            Email {emailSortOrder === 'asc' ? '↑' : emailSortOrder === 'desc' ? '↓' : '↕'}
          </button>
        </div>
      </div>

      {(selectedCompany !== 'all' || isMutating) && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {selectedCompany !== 'all' && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
              <span>Company: {selectedCompany}</span>
              <button
                onClick={onCompanyClear}
                className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                aria-label={`Clear company filter: ${selectedCompany}`}
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          {isMutating && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium" role="status" aria-label="Processing">
              <div className="w-3 h-3 border-2 border-gray-600 dark:border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          )}
        </div>
      )}
    </>
  )
}

