import { User } from '@/lib/types/user'

/**
 * API Base URL from environment variable
 * Fallback to JSONPlaceholder if not set
 */
const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || 'https://jsonplaceholder.typicode.com'

/**
 * Security headers for API requests
 */
const getSecurityHeaders = (): HeadersInit => ({
	'Content-Type': 'application/json',
	'X-Requested-With': 'XMLHttpRequest',
	// Additional security headers
	Accept: 'application/json',
})

export const userApi = {
	/**
	 * Fetch user data from API
	 * @returns Promise<User[]>
	 */
	async getUsers(): Promise<User[]> {
		try {
			const response = await fetch(`${API_BASE_URL}/users`, {
				method: 'GET',
				headers: getSecurityHeaders(),
				next: { revalidate: 3600 }, // revalidation of cache
			})

			if (!response.ok) {
				throw Error(`HTTP error, status: ${response.status}`)
			}

			const data = await response.json()
			return data as User[]
		} catch (error) {
			console.error('Error fetching users:', error)
			throw error
		}
	},

	/**
	 * Delete a user
	 */
	async deleteUser(userId: number): Promise<void> {
		try {
			const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
				method: 'DELETE',
				headers: getSecurityHeaders(),
			})

			if (!response.ok) {
				throw new Error(`HTTP error, status: ${response.status}`)
			}
		} catch (error) {
			console.error('Error deleting user', error)
			throw error
		}
	},
}
