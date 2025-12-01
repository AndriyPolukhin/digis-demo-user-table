/**
 * Security utility functions
 */

/**
 * Sanitize user input to prevent XSS attacks
 * Removes potentially dangerous characters like < and >
 * @param input - Raw user input string
 * @returns Sanitized string safe for use
 */
export function sanitizeInput(input: string): string {
	if (typeof input !== 'string') {
		return ''
	}

	// Remove HTML tags and potentially dangerous characters
	return input
		.replace(/[<>]/g, '') // Remove < and >
		.replace(/javascript:/gi, '') // Remove javascript: protocol
		.replace(/on\w+=/gi, '') // Remove event handlers like onclick=
		.trim()
}

/**
 * Validate search query
 * @param query - Search query string
 * @returns Boolean indicating if query is valid
 */
export function isValidSearchQuery(query: string): boolean {
	// Check if query is a string and within reasonable length
	if (typeof query !== 'string') {
		return false
	}

	// Max length check (prevent DoS via extremely long strings)
	if (query.length > 100) {
		return false
	}

	return true
}

/**
 * Sanitize and validate user input
 * @param input - Raw user input
 * @returns Sanitized and validated input, or empty string if invalid
 */
export function sanitizeAndValidate(input: string): string {
	if (!isValidSearchQuery(input)) {
		return ''
	}

	return sanitizeInput(input)
}
