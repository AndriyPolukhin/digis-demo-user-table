'use client'

import { memo, useCallback, useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { useUserStore } from '@/lib/store/userStore'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { sanitizeInput } from '@/lib/utils/security'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export const SearchBar = memo(() => {
	// Selective store subscription
	const searchQuery = useUserStore((state) => state.searchQuery)
	const setSearchQuery = useUserStore((state) => state.setSearchQuery)

	// Local state for immediate UI updates
	const [localValue, setLocalValue] = useState(searchQuery)

	// Track if component has mounted to avoid calling setSearchQuery on initial render
	const isMounted = useRef(false)

	// Debounce the local value (300ms delay)
	const debouncedValue = useDebounce(localValue, 300)

	// Update store when debounced value changes (but not on initial mount)
	useEffect(() => {
		if (isMounted.current) {
			setSearchQuery(debouncedValue)
		} else {
			isMounted.current = true
		}
	}, [debouncedValue, setSearchQuery])

	// Sync local value when store updates externally (e.g., clear button)
	useEffect(() => {
		setLocalValue(searchQuery)
	}, [searchQuery])

	const handleClear = useCallback(() => {
		setLocalValue('')
		setSearchQuery('')
	}, [setSearchQuery])

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			// Sanitize input to prevent XSS attacks
			const sanitizedValue = sanitizeInput(e.target.value)
			setLocalValue(sanitizedValue)
		},
		[],
	)

	return (
		<div className='relative w-full max-w-sm'>
			<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
			<Input
				type='text'
				placeholder='Search by name or email'
				value={localValue}
				onChange={handleChange}
				className='pl-10 pr-10'
			/>
			{localValue && (
				<Button
					variant='ghost'
					size='sm'
					onClick={handleClear}
					className='absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0'
				>
					<X className='h-4 w-4' />
				</Button>
			)}
		</div>
	)
})

SearchBar.displayName = 'SearchBar'
