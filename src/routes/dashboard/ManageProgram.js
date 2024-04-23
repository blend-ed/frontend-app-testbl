import { v4 as uuid } from 'uuid';

export const ManageProgram = [

	// Programs->Single children are used in below component for the comparision of router link and name
	// If you are changing main routes titles, i.e. Programs and Single you also need to modify on below component.
	// src/components/student/programs/single/CommonHeaderTabs.js
	{
		id: uuid(),
		title: 'Programs',
		children: [
		{
			id: uuid(),
			link: '/details',
			name: 'Details'
		},
		{
			id: uuid(),
			link: '/enrollment',
			name: 'Enrollment'
		},
	]
	}
];

export default ManageProgram;
