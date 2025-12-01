import {
	sanitizeInput,
	isValidSearchQuery,
	sanitizeAndValidate,
} from '@/lib/utils/security'

describe('Security Utils', () => {
	describe('sanitizeInput', () => {
		it('should remove HTML tags', () => {
			const input = '<script>alert("XSS")</script>'
			const result = sanitizeInput(input)
			expect(result).toBe('scriptalert("XSS")/script')
		})

		it('should remove < and > characters', () => {
			const input = 'test <> string'
			const result = sanitizeInput(input)
			expect(result).toBe('test  string')
		})

		it('should remove javascript: protocol', () => {
			const input = 'javascript:alert(1)'
			const result = sanitizeInput(input)
			expect(result).toBe('alert(1)')
		})

		it('should remove event handlers', () => {
			const input = 'test onclick=alert(1)'
			const result = sanitizeInput(input)
			expect(result).toBe('test alert(1)')
		})

		it('should handle normal text without modification', () => {
			const input = 'John Doe'
			const result = sanitizeInput(input)
			expect(result).toBe('John Doe')
		})

		it('should handle email addresses', () => {
			const input = 'john@example.com'
			const result = sanitizeInput(input)
			expect(result).toBe('john@example.com')
		})

		it('should trim whitespace', () => {
			const input = '  test  '
			const result = sanitizeInput(input)
			expect(result).toBe('test')
		})

		it('should handle empty string', () => {
			const input = ''
			const result = sanitizeInput(input)
			expect(result).toBe('')
		})

		it('should return empty string for non-string input', () => {
			const result = sanitizeInput(null as any)
			expect(result).toBe('')
		})

		it('should handle mixed dangerous content', () => {
			const input = '<img src=x onerror=alert(1)>'
			const result = sanitizeInput(input)
			expect(result).toBe('img src=x alert(1)')
		})
	})

	describe('isValidSearchQuery', () => {
		it('should accept valid strings', () => {
			expect(isValidSearchQuery('John')).toBe(true)
			expect(isValidSearchQuery('john@example.com')).toBe(true)
			expect(isValidSearchQuery('Test Company')).toBe(true)
		})

		it('should accept empty strings', () => {
			expect(isValidSearchQuery('')).toBe(true)
		})

		it('should reject non-string values', () => {
			expect(isValidSearchQuery(null as any)).toBe(false)
			expect(isValidSearchQuery(undefined as any)).toBe(false)
			expect(isValidSearchQuery(123 as any)).toBe(false)
			expect(isValidSearchQuery({} as any)).toBe(false)
		})

		it('should reject strings longer than 100 characters', () => {
			const longString = 'a'.repeat(101)
			expect(isValidSearchQuery(longString)).toBe(false)
		})

		it('should accept strings up to 100 characters', () => {
			const maxString = 'a'.repeat(100)
			expect(isValidSearchQuery(maxString)).toBe(true)
		})
	})

	describe('sanitizeAndValidate', () => {
		it('should sanitize and validate valid input', () => {
			const input = '<script>John Doe</script>'
			const result = sanitizeAndValidate(input)
			expect(result).toBe('scriptJohn Doe/script')
		})

		it('should return empty string for invalid input', () => {
			const longString = 'a'.repeat(101)
			const result = sanitizeAndValidate(longString)
			expect(result).toBe('')
		})

		it('should handle normal text', () => {
			const input = 'John Doe'
			const result = sanitizeAndValidate(input)
			expect(result).toBe('John Doe')
		})

		it('should return empty string for non-string input', () => {
			const result = sanitizeAndValidate(null as any)
			expect(result).toBe('')
		})

		it('should sanitize email addresses correctly', () => {
			const input = 'test@example.com'
			const result = sanitizeAndValidate(input)
			expect(result).toBe('test@example.com')
		})

		it('should handle XSS attempts', () => {
			const xssAttempts = [
				'<img src=x onerror=alert(1)>',
				'javascript:alert(1)',
				'<script>alert("XSS")</script>',
				'onclick=alert(1)',
			]

			xssAttempts.forEach((attempt) => {
				const result = sanitizeAndValidate(attempt)
				expect(result).not.toContain('<')
				expect(result).not.toContain('>')
				expect(result).not.toContain('javascript:')
				expect(result).not.toContain('onclick=')
			})
		})

		it('should preserve legitimate search queries', () => {
			const legitimateQueries = [
				'John Doe',
				'john@example.com',
				'Romaguera-Crona',
				'New York',
				'123 Main St',
			]

			legitimateQueries.forEach((query) => {
				const result = sanitizeAndValidate(query)
				expect(result).toBe(query)
			})
		})
	})

	describe('Security Edge Cases', () => {
		it('should handle multiple XSS patterns in one string', () => {
			const input =
				'<script>alert(1)</script><img src=x onerror=alert(2)>'
			const result = sanitizeInput(input)
			expect(result).not.toContain('<')
			expect(result).not.toContain('>')
		})

		it('should handle case-insensitive javascript protocol', () => {
			expect(sanitizeInput('JavaScript:alert(1)')).not.toContain(
				'JavaScript:',
			)
			expect(sanitizeInput('JAVASCRIPT:alert(1)')).not.toContain(
				'JAVASCRIPT:',
			)
			expect(sanitizeInput('JaVaScRiPt:alert(1)')).not.toContain(
				'JaVaScRiPt:',
			)
		})

		it('should handle unicode and special characters', () => {
			const input = 'José García'
			const result = sanitizeInput(input)
			expect(result).toBe('José García')
		})

		it('should handle numbers in search', () => {
			const input = '123456'
			const result = sanitizeInput(input)
			expect(result).toBe('123456')
		})

		it('should handle special search characters', () => {
			const input = 'test@example.com'
			const result = sanitizeInput(input)
			expect(result).toBe('test@example.com')
		})
	})
})
