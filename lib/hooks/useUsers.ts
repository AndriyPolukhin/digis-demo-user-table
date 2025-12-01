'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '@/lib/api/users'
import { User } from '@/lib/types/user'

export const USERS_QUERY_KEY = ['users']

/**
 * Fetch and manage users data
 */
export function useUsers() {
	const queryClient = useQueryClient()

	// Fetch users
	const {
		data: users = [],
		isLoading,
		isError,
		error,
		refetch,
	} = useQuery<User[], Error>({
		queryKey: USERS_QUERY_KEY,
		queryFn: userApi.getUsers,
		staleTime: 5 * 60 * 1000, // 5 min data refresh
		gcTime: 10 * 60 * 1000, // 10 min cache
	})

	// Delete user
	const deleteMutation = useMutation({
		mutationFn: userApi.deleteUser,
		onMutate: async (userId) => {
			// Cancel outgoing refetches
			await queryClient.cancelQueries({ queryKey: USERS_QUERY_KEY })

			// Snapshot previous value
			const previousUsers =
				queryClient.getQueryData<User[]>(USERS_QUERY_KEY)

			// Optimistically update cache
			queryClient.setQueryData<User[]>(USERS_QUERY_KEY, (old = []) =>
				old.filter((user) => user.id !== userId),
			)

			// Return context for rollback
			return { previousUsers }
		},
		onError: (err, userId, context) => {
			// Rollback on error
			if (context?.previousUsers) {
				queryClient.setQueryData(USERS_QUERY_KEY, context.previousUsers)
			}
		},
		onSettled: () => {
			// Refetch after mutation
			queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })
		},
	})

	return {
		users,
		isLoading,
		isError,
		error,
		refetch,
		deleteUser: deleteMutation.mutate,
		isDeleting: deleteMutation.isPending,
	}
}
