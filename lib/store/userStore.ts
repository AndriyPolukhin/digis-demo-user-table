import { create } from 'zustand'
import { User, UserTableData } from '@/lib/types/user'
import { sanitizeInput } from '@/lib/utils/security'

interface UserState {
	// State
	users: User[]
	filteredUsers: UserTableData[]
	searchQuery: string
	deletedUserIds: Set<number>

	// Actions
	setUsers: (users: User[]) => void
	deleteUser: (userId: number) => void
	setSearchQuery: (query: string) => void
	getTableData: () => UserTableData[]
}

/**
 * ETL User to UserTableData
 */
function transformToTableData(user: User): UserTableData {
	return {
		id: user.id,
		name: user.name,
		email: user.email,
		companyName: user.company.name,
		city: user.address.city,
	}
}

/**
 * Filter users based on the search "q"
 */
function filterUsers(users: User[], query: string): User[] {
	if (!query.trim()) return users

	const searchValue = query.toLowerCase()
	return users.filter(
		(user: User) =>
			user.name.toLowerCase().includes(searchValue) ||
			user.email.toLowerCase().includes(searchValue),
	)
}

export const useUserStore = create<UserState>((set, get) => ({
	users: [],
	filteredUsers: [],
	searchQuery: '',
	deletedUserIds: new Set(),

	setUsers: (users: User[]) => {
		const { searchQuery, deletedUserIds } = get()

		// Filter out deleted users
		const activeUsers = users.filter(
			(user: User) => !deletedUserIds.has(user.id),
		)

		// Apply search filter
		const filtered = filterUsers(activeUsers, searchQuery)

		set({
			users: activeUsers,
			filteredUsers: filtered.map(transformToTableData),
		})
	},

	deleteUser: (userId: number) => {
		const { users, searchQuery, deletedUserIds } = get()

		// Add to deleted set
		const newDeletedIds = new Set(deletedUserIds).add(userId)

		// Filter users
		const activeUsers = users.filter(
			(user: User) => !newDeletedIds.has(user.id),
		)
		const filtered = filterUsers(activeUsers, searchQuery)

		set({
			users: activeUsers,
			deletedUserIds: newDeletedIds,
			filteredUsers: filtered.map(transformToTableData),
		})
	},

	setSearchQuery: (query) => {
		const { users } = get()
		// Sanitize the search query for security
		const sanitizedQuery = sanitizeInput(query)
		const filtered = filterUsers(users, sanitizedQuery)

		set({
			searchQuery: sanitizedQuery,
			filteredUsers: filtered.map(transformToTableData),
		})
	},

	getTableData: () => {
		return get().filteredUsers
	},
}))
