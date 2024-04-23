import { v4 as uuid } from 'uuid';

export const AdminDashboardMenu = [
	{
		id: uuid(),
		title: 'Dashboard',
		icon: 'home',
		link: '/a/dashboard'
	},
    {
        id: uuid(),
        title: 'Manage',
        icon: 'briefcase',
        children: [
            {
                id: uuid(),
                title: 'Team',
                icon: 'users',
                link: '/a/team-management'
            },
            // {
            //     id: uuid(),
            //     title: 'Sub-org',
            //     icon: 'layers',
            //     link: '/a/suborg-management'
            // }
        ]
    },
    {
        id: uuid(),
        title: 'Calendar',
        icon: 'calendar',
        link: '/a/calendar'
    },
    {
        id: uuid(),
        title: 'Settings',
        icon: 'settings',
        link: '/a/settings'
    },
	{
		id: uuid(),
		title: 'Marketing',
		icon: 'star',
		link: '/a/marketing'
	},
    // {
    //     id: uuid(),
    //     title: 'Billing',
    //     icon: 'credit-card',
    //     link: '/a/billing'
    // },
    { 
		id: uuid(), 
		link: '/a/send-notifications',
		title: 'Send Notifications', 
		icon: 'bell'
	},
    {
        id: uuid(),
        title: 'Academics',
        icon: 'book',
        link: '/i/academics'
    },
];

export default AdminDashboardMenu;
