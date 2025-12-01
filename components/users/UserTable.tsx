'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Loader2 } from 'lucide-react'
import { useUsers } from '@/lib/hooks/useUsers'
import { useUserStore } from '@/lib/store/userStore'
import { DeleteDialog } from './DeleteDialog'
import { EmptyState } from './EmptyState'
import { SearchBar } from './SearchBar'
import { UserTableRow } from './UserTableRow'

export function UserTable() {
	const { users, isLoading, isError, error } = useUsers()

	// Optimized Zustand selectors
	const filteredUsers = useUserStore((state) => state.filteredUsers)
	const searchQuery = useUserStore((state) => state.searchQuery)
	const setUsers = useUserStore((state) => state.setUsers)
	const deleteUser = useUserStore((state) => state.deleteUser)
	const setSearchQuery = useUserStore((state) => state.setSearchQuery)

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [userToDelete, setUserToDelete] = useState<{
		id: number
		name: string
	} | null>(null)

	// Sync React Query data to Zustand store only when users data changes
	// We use JSON.stringify to create a stable dependency since setUsers can trigger re-renders
	const usersJson = JSON.stringify(users?.map((u) => u.id) || [])

	useEffect(() => {
		if (users && users.length > 0) {
			setUsers(users)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [usersJson]) // Only re-run when user IDs actually change

	// Memoize user count string to prevent unnecessary recalculations
	const userCountText = useMemo(
		() =>
			filteredUsers.length === 0
				? 'No users'
				: `Showing ${filteredUsers.length} user${
						filteredUsers.length !== 1 ? 's' : ''
				  }`,
		[filteredUsers.length],
	)

	// Memoize handlers to prevent unnecessary re-renders
	const handleDeleteClick = useCallback((id: number, name: string) => {
		setUserToDelete({ id, name })
		setDeleteDialogOpen(true)
	}, [])

	const handleDeleteConfirm = useCallback(() => {
		if (userToDelete) {
			deleteUser(userToDelete.id)
			setDeleteDialogOpen(false)
			setUserToDelete(null)
		}
	}, [userToDelete, deleteUser])

	const handleResetSearch = useCallback(() => {
		setSearchQuery('')
	}, [setSearchQuery])

	// Loading state
	if (isLoading) {
		return (
			<div
				className='flex h-96 items-center justify-center'
				role='status'
			>
				<Loader2 className='h-8 w-8 animate-spin text-gray-400' />
			</div>
		)
	}

	// Error state
	if (isError) {
		return (
			<div className='rounded-lg border border-red-200 bg-red-50 p-4'>
				<h3 className='text-lg font-semibold text-red-800'>
					Error loading users
				</h3>
				<p className='mt-2 text-sm text-red-600'>
					{error?.message ||
						'Something went wrong. Please try again.'}
				</p>
			</div>
		)
	}

	return (
		<div className='space-y-4'>
			{/* Header with search */}
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h2 className='text-2xl font-bold tracking-tight'>Users</h2>
					<p className='text-sm text-gray-500'>{userCountText}</p>
				</div>
				<SearchBar />
			</div>

			{/* Table */}
			{filteredUsers.length === 0 ? (
				<EmptyState
					isSearching={searchQuery.length > 0}
					onReset={handleResetSearch}
				/>
			) : (
				<div className='rounded-lg border overflow-x-auto'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className='w-[250px]'>
									Name
								</TableHead>
								<TableHead className='w-[250px]'>
									Email
								</TableHead>
								<TableHead className='w-[200px]'>
									Company
								</TableHead>
								<TableHead className='w-[150px]'>
									City
								</TableHead>
								<TableHead className='w-[100px] text-right'>
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredUsers.map((user) => (
								<UserTableRow
									key={user.id}
									user={user}
									onDelete={handleDeleteClick}
								/>
							))}
						</TableBody>
					</Table>
				</div>
			)}

			{/* Delete confirmation dialog */}
			<DeleteDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				userName={userToDelete?.name || ''}
				onConfirm={handleDeleteConfirm}
			/>
		</div>
	)
}
