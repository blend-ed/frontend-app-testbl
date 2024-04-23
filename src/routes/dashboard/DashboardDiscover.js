import { v4 as uuid } from 'uuid';

export const DashboardDiscover = [

	{
		id: uuid(),
		title: 'Tabs',
		children: [
		{
			id: uuid(),
			link: '/dashboard',
			name: 'Home'
		},
		{ id: uuid(), link: '/discover', name: 'Discover New' },
		]
	}
];

export default DashboardDiscover;
