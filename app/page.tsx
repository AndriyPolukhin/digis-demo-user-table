import { UserTable } from '@/components/users/UserTable'

export default function Home() {
	return (
		<main className='min-h-screen bg-gray-50'>
			<div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
				<div className='mb-8'>
					<h1 className='text-3xl font-bold tracking-tight text-gray-900'>
						User Management Dashboard
					</h1>
					<p className='mt-2 text-sm text-gray-600'>
						Manage and search through your user list
					</p>
				</div>
				<div className='rounded-lg bg-white p-6 shadow'>
					<UserTable />
				</div>
			</div>
		</main>
	)
}
