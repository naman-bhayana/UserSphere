import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useUsers, useAddUser, useUpdateUser, useDeleteUser } from '../hooks/useUsers'
import { useAppStore } from '../stores/useAppStore'
import useDebounce from '../hooks/useDebounce'
import type { User } from '../types'
import UsersControls from './UsersControls'
import UsersTable from './UsersTable'
import PaginationControls from './PaginationControls'
import ActivityLog from './ActivityLog'
import UserDialog from './UserDialog'
import ConfirmDeleteDialog from './ConfirmDeleteDialog'
import { validateUser } from '../utils/userUtils'

type EmailSortOrder = 'asc' | 'desc' | null

const ITEMS_PER_PAGE = 10

export default function UsersContainer() {
  const router = useRouter()
  const { data: users, isLoading, error } = useUsers()
  const rows = users ?? []

  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
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

  const isMutating = addUserMutation.isPending || updateUserMutation.isPending || deleteUserMutation.isPending

  const companies = useMemo(() => {
    if (!rows.length) return []
    const uniqueCompanies = Array.from(new Set(rows.map((user) => user.company.name)))
    return uniqueCompanies.sort()
  }, [rows])

  const filteredAndSortedUsers = useMemo(() => {
    if (!rows.length) return []

    let filtered: User[] = rows

    if (debouncedSearchTerm) {
      filtered = filtered.filter((user) =>
        user.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
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
  }, [rows, debouncedSearchTerm, selectedCompany, emailSortOrder])

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return (filteredAndSortedUsers ?? []).slice(startIndex, endIndex)
  }, [filteredAndSortedUsers, currentPage])

  const totalPages = Math.max(1, Math.ceil((filteredAndSortedUsers?.length ?? 0) / ITEMS_PER_PAGE))

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm, selectedCompany, emailSortOrder])

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [totalPages, currentPage])

  const handleSubmit = (payload: { name: string; email: string; phone: string; company: string }) => {
    if (!validateUser(payload.name, payload.email, payload.phone)) {
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

  const handleEmailSortToggle = () => {
    if (emailSortOrder === null) {
      setEmailSortOrder('asc')
    } else if (emailSortOrder === 'asc') {
      setEmailSortOrder('desc')
    } else {
      setEmailSortOrder(null)
    }
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
      <UsersControls
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        isSearching={searchTerm !== debouncedSearchTerm}
        selectedCompany={selectedCompany}
        companyOptions={companies}
        onCompanyChange={setSelectedCompany}
        onCompanyClear={() => setSelectedCompany('all')}
        emailSortOrder={emailSortOrder}
        onEmailSortToggle={handleEmailSortToggle}
        onAddClick={handleAdd}
        isMutating={isMutating}
      />

      <UsersTable
        users={paginatedUsers}
        isLoading={isLoading}
        emailSortOrder={emailSortOrder}
        onEmailSortToggle={handleEmailSortToggle}
        onRowClick={(userId) => router.push(`/users/${userId}`)}
        onEdit={handleEdit}
        onDeleteClick={handleDeleteClick}
      />

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredAndSortedUsers.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />

      <div className="mt-8">
        <ActivityLog />
      </div>

      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editingUser}
        onSubmit={handleSubmit}
      />

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        userName={userToDelete?.name || ''}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteDialogOpen(false)
          setUserToDelete(undefined)
        }}
      />
    </div>
  )
}

