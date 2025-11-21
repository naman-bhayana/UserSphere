import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/router'
import * as Select from '@radix-ui/react-select'
import * as Dialog from '@radix-ui/react-dialog'
import { useUsers, useAddUser, useUpdateUser, useDeleteUser } from '../../src/hooks/useUsers'
import { useAppStore } from '../../src/stores/useAppStore'
import UserDialog from '../../src/components/UserDialog'
import ActivityLog from '../../src/components/ActivityLog'
import type { User } from '../../src/types'

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

type EmailSortOrder = 'asc' | 'desc' | null

const ITEMS_PER_PAGE = 10

export default function UsersPage() {
  const router = useRouter()
  const { data: users, isLoading, error } = useUsers()

  const [searchTerm, setSearchTerm] = useState('')
  const [emailSortOrder, setEmailSortOrder] = useState<EmailSortOrder>(null)
  const [selectedCompany, setSelectedCompany] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | undefined>(undefined)

  const addUserMutation = useAddUser()
  const updateUserMutation = useUpdateUser()
  const deleteUserMutation = useDeleteUser()
  const { addLog } = useAppStore()

  const companies = useMemo(() => {
    if (!users) return []
    const uniqueCompanies = Array.from(new Set(users.map((user) => user.company.name)))
    return uniqueCompanies.sort()
  }, [users])

  const filteredAndSortedUsers = useMemo(() => {
    if (!users) return []

    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCompany !== 'all') {
      filtered = filtered.filter((user) => user.company.name === selectedCompany)
    }

    if (emailSortOrder) {
      filtered = [...filtered].sort((a, b) => {
        if (emailSortOrder === 'asc') {
          return a.email.localeCompare(b.email)
        } else {
          return b.email.localeCompare(a.email)
        }
      })
    }

    return filtered
  }, [users, searchTerm, selectedCompany, emailSortOrder])

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return filteredAndSortedUsers.slice(startIndex, endIndex)
  }, [filteredAndSortedUsers, currentPage])

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedUsers.length / ITEMS_PER_PAGE))

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCompany, emailSortOrder])

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [totalPages, currentPage])

  const validateForm = (name: string, email: string): boolean => {
    if (!name.trim()) {
      alert('Name is required')
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address')
      return false
    }
    return true
  }

  const handleSubmit = (payload: { name: string; email: string; phone: string; company: string }) => {
    if (!validateForm(payload.name, payload.email)) {
      return
    }

    if (editingUser) {
      updateUserMutation.mutate(
        { ...payload, id: editingUser.id },
        {
          onSuccess: () => {
            addLog('edit', `Edited user ${payload.name}`)
            setDialogOpen(false)
            setEditingUser(undefined)
          },
          onError: () => {
            alert('Failed to update user. Please try again.')
          },
        }
      )
    } else {
      addUserMutation.mutate(payload, {
        onSuccess: () => {
          addLog('add', `Added user ${payload.name}`)
          setDialogOpen(false)
        },
        onError: () => {
          alert('Failed to add user. Please try again.')
        },
      })
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingUser(undefined)
    setDialogOpen(true)
  }

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      const userName = userToDelete.name
      deleteUserMutation.mutate(userToDelete.id, {
        onSuccess: () => {
          addLog('delete', `Deleted user ${userName}`)
          setDeleteDialogOpen(false)
          setUserToDelete(undefined)
        },
        onError: () => {
          alert('Failed to delete user. Please try again.')
          setDeleteDialogOpen(false)
          setUserToDelete(undefined)
        },
      })
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading users...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 dark:text-red-400 font-medium">Error loading users</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
            Users
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your user database</p>
        </div>
        <button
          onClick={handleAdd}
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
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
          />
        </div>

        <div className="flex gap-4">
          <Select.Root value={selectedCompany} onValueChange={setSelectedCompany}>
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
                  {companies.map((company) => (
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
            onClick={() => {
              if (emailSortOrder === null) {
                setEmailSortOrder('asc')
              } else if (emailSortOrder === 'asc') {
                setEmailSortOrder('desc')
              } else {
                setEmailSortOrder(null)
              }
            }}
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

      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/50 backdrop-blur-sm">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" role="table" aria-label="Users table">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Avatar
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Phone
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Company
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900/50 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">No users found</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user: User) => (
                <tr key={user.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 dark:hover:from-gray-800 dark:hover:to-gray-800 transition-all duration-200 group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-md ring-2 ring-white dark:ring-gray-800 group-hover:scale-110 transition-transform duration-200">
                      {getInitials(user.name)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => router.push(`/users/${user.id}`)}
                      className="text-sm font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1 py-1"
                      aria-label={`View details for ${user.name}`}
                    >
                      {user.name}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600 dark:text-gray-300">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600 dark:text-gray-300">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      {user.company.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
                        aria-label={`Edit user ${user.name}`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors duration-200 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded px-2 py-1"
                        aria-label={`Delete user ${user.name}`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filteredAndSortedUsers.length > 0 && totalPages > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredAndSortedUsers.length)}</span> to{' '}
            <span className="font-semibold text-gray-900 dark:text-white">{Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedUsers.length)}</span> of{' '}
            <span className="font-semibold text-gray-900 dark:text-white">{filteredAndSortedUsers.length}</span> users
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || totalPages === 0}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center gap-2 shadow-sm"
              aria-label="Go to previous page"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700" aria-label={`Page ${currentPage} of ${totalPages}`}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center gap-2 shadow-sm"
              aria-label="Go to next page"
            >
              Next
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="mt-8">
        <ActivityLog />
      </div>

      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editingUser}
        onSubmit={handleSubmit}
      />

      <Dialog.Root open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md z-50 focus:outline-none border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-white">
                  Delete User
                </Dialog.Title>
                <Dialog.Description className="text-gray-600 dark:text-gray-400 mt-1">
                  Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">{userToDelete?.name}</span>? This action cannot be undone.
                </Dialog.Description>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-5 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2.5 text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-lg transition-all duration-200 font-medium"
                aria-label="Confirm delete user"
              >
                Delete
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

