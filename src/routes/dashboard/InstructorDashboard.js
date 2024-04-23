import { v4 as uuid } from 'uuid';

export const InstructorDashboardMenu = [
	{
		id: uuid(),
		title: 'Dashboard',
		icon: 'home',
		link: '/i/dashboard'
	},
    {
        id: uuid(),
        title: 'Academics',
        icon: 'book',
        link: '/i/academics',
		link2: 'program'
    },
	{
		id: uuid(),
		title: 'Analytics',
		icon: 'activity',
		link: '/i/analytics',
	},
	{
		id: uuid(),
		title: 'Calendar',
		icon: 'calendar',
		link: '/i/calendar'
	},
	{
		id: uuid(),
		title: 'Chat',
		icon: 'message-circle',
		link: '/i/chat'
	},
	{
		id: uuid(),
		title: 'Account',
		icon: 'user',
		link: '/i/account',
	},
	{ 
		id: uuid(), 
		link: '/i/video-library', 
		title: 'Video Library', 
		icon: 'video'
	},
	{
		id: uuid(),
		link: '/i/video-catalog',
		title: 'Video Catalog',
		icon: 'film'
	},
	{
		id: uuid(),
		title: 'Send Notifications',
		icon: 'send',
		link: '/i/send-notifications'
	},
	{
		id: uuid(),
		title: 'Notifications',
		icon: 'bell',
		link: '/i/notifications'
	},
];

export default InstructorDashboardMenu;
