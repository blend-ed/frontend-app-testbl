import { v4 as uuid } from 'uuid';

/**
 *  All Dashboard Routes
 *
 *  Understanding name/value pairs for Dashboard routes
 *
 *  Applicable for main/root/level 1 routes
 *  icon 		: String - It's only for main menu or you can consider 1st level menu item to specify icon name.
 *
 *  Applicable for main/root/level 1 and subitems routes
 * 	id 			: Number - You can use uuid() as value to generate unique ID using uuid library, you can also assign constant unique ID for react dynamic obgrams.
 *  title 		: String - If menu contains childern use title to provide main menu name.
 *  badge 		: String - (Optional - Default - '') If you specify badge value it will be displayed beside the menu title or menu item.
 * 	badgecolor 	: String - (Optional - Default - 'primary' ) - Used to specify badge background color.
 *
 *  Applicable for subitems / children items routes
 *  name 		: String - If it's menu item in which you are specifiying link, use name ( don't use title for that )
 *  children	: Array - Use to specify submenu items
 *
 *  Used to segrigate menu groups
 *  grouptitle : Boolean - (Optional - Default - false ) If you want to group menu items you can use grouptitle = true,
 *  ( Use title : value to specify group title  e.g. COMPONENTS , DOCUMENTATION that we did here. )
 *
 */

export const StudentDashboardMenu = [
	{
		id: uuid(),
		title: 'Dashboard',
		icon: 'home',
		link: '/dashboard',
		mobile: false
	},
	{
		id: uuid(),
		title: 'Discover',
		icon: 'search',
		link: '/discover',
		mobile: false
	},
	{
		id: uuid(),
		title: 'Learn',
		icon: 'box',
		link: '/learn',
		link2: '/programs',
		mobile: false
	},
	{
		id: uuid(),
		title: 'Progress',
		icon: 'activity',
		link: '/progress',
	},
	{
		id: uuid(),
		title: 'Calendar',
		icon: 'calendar',
		link: '/calendar'
	},
	{
		id: uuid(),
		title: 'Chat',
		icon: 'message-circle',
		link: '/chat'
	},

	// {
	// 	id: uuid(),
	// 	title: 'Social',
	// 	grouptitle: true
	// },
	// {
	// 	id: uuid(),
	// 	title: 'Chat',
	// 	icon: 'message-circle',
	// 	link: '/chat',

	// 	// children: [
	// 	// 	{ id: uuid(), link: '/user/chat', name: 'Chat' },
	// 	// 	{ id: uuid(), link: '/user/events', name: 'Events' },
	// 	// 	{ id: uuid(), link: '/user/clubs', name: 'Clubs' },
	// 	// 	{ id: uuid(), link: '/user/games', name: 'Games' }
	// 	// ]
	// },
	// {
	// 	id: uuid(),
	// 	title: 'Events',
	// 	icon: 'sun',
	// },
	// {
	// 	id: uuid(),
	// 	title: 'Clubs',
	// 	icon: 'stop-circle',
	// },
	// {
	// 	id: uuid(),
	// 	title: 'Games',
	// 	icon: 'target',
	// 	link: '/games',
	// },

	{
		id: uuid(),
		title: 'Account',
		icon: 'user',
		link: '/account'
	},
	{
		id: uuid(),
		title: 'Payments',
		icon: 'credit-card',
		link: '/payment'
	},
    {
		id: uuid(),
		title: 'Notifications',
		icon: 'bell',
		link: '/notifications'
	},
];

export default StudentDashboardMenu;
