import { memo } from 'react'
import { Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
	isSearching: boolean
	onReset?: () => void
}

export const EmptyState = memo(({ isSearching, onReset }: EmptyStateProps) => {
	if (isSearching) {
		return (
			<div className='flex flex-col items-center justify-center py-12'>
				<div className='rounded-full bg-gray-100 p-3'>
					<Users className='h-6 w-6 text-gray-400' />
				</div>
				<h3 className='mt-4 text-lg font-semibold'>No users found</h3>
				<p className='mt-2 text-sm text-gray-500'>
					Try adjusting your search terms
				</p>
				{onReset && (
					<Button
						onClick={onReset}
						variant='outline'
						className='mt-4'
					>
						Clear search
					</Button>
				)}
			</div>
		)
	}

	return (
		<div className='flex flex-col items-center justify-center py-12'>
			<div className='rounded-full bg-gray-100 p-3'>
				<Users className='h-6 w-6 text-gray-400' />
			</div>
			<h3 className='mt-4 text-lg font-semibold'>No users to display</h3>
			<p className='mt-2 text-sm text-gray-500'>
				All users have been removed from the list
			</p>
		</div>
	)
})

EmptyState.displayName = 'EmptyState'
