import Link from 'next/link'
import { MainLayout } from '@/layouts/MainLayout'

export default function ErrorPage() {
	return (
		<MainLayout title="404">
			<div className="container">
				<h1>Error 404. Page Not Found</h1>
				<p>
					<Link href={'/'}>Home</Link>
				</p>
			</div>
		</MainLayout>
	)
}
