import type { MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import TopBar from '../components/topbar';
import Landing from '../components/landing';

export const meta: MetaFunction = () => {
	return [
		{ title: 'AnyWeb' },
		{
			name: 'description',
			content:
				'AnyWeb is a sleek and fast web service for bypassing internet censorship'
		}
	];
};

export default function Index() {
	return (
		<main className="h-screen overflow-hidden">
			<Link to="/g" prefetch="render" />

			<TopBar />

			<Landing />
		</main>
	);
}
