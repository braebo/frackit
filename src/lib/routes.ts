import type { Route } from './router/router.types'

export type Routes = typeof routes

export const routes = [
	{
		path: '/',
		title: 'Home',
		children: [],
	},
	{
		path: '/design',
		title: 'Design',
		children: [
			{
				path: '/design/elements',
				title: 'Elements',
				children: [],
			},
			{
				path: '/design/inputs',
				title: 'Inputs',
				children: [],
			},
			{
				path: '/design/tokens',
				title: 'Tokens',
				children: [],
			},
		],
	},
	{
		path: '/about',
		title: 'About',
		children: [],
	},
	{
		dev: true,
		path: '/playground',
		title: 'Playground',
		children: [
			{
				path: '/playground/misc',
				title: 'Miscellaneous',
				children: [
					{
						path: '/playground/misc/nested',
						title: 'Nested',
						children: [],
					},
				],
			},
		],
	},
] as const satisfies Route[]
