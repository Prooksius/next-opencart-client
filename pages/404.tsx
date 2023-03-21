import Link from 'next/link'
import { MainLayout } from '@/layouts/MainLayout'

export default function ErrorPage() {
	return (
		<MainLayout title="404" h1="Error 404. Page Not Found" pageCode="404">
			<p>
				<Link href={'/'}>Home</Link>
			</p>
		</MainLayout>
	)
}
