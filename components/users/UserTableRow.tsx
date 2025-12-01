import { memo } from 'react'
import { TableCell, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { UserTableData } from '@/lib/types/user'

interface UserTableRowProps {
	user: UserTableData
	onDelete: (id: number, name: string) => void
}

// User row component
export const UserTableRow = memo(({ user, onDelete }: UserTableRowProps) => {
	return (
		<TableRow className='hover:bg-gray-50'>
			<TableCell className='font-medium'>{user.name}</TableCell>
			<TableCell className='text-gray-600'>{user.email}</TableCell>
			<TableCell className='text-gray-600'>{user.companyName}</TableCell>
			<TableCell className='text-gray-600'>{user.city}</TableCell>
			<TableCell className='text-right'>
				<Button
					variant='ghost'
					size='sm'
					onClick={() => onDelete(user.id, user.name)}
					className='text-red-600 hover:bg-red-50 hover:text-red-700'
				>
					<Trash2 className='h-4 w-4' />
				</Button>
			</TableCell>
		</TableRow>
	)
})

UserTableRow.displayName = 'UserTableRow'
