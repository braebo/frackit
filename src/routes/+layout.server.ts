import type { ExtractPaths, Route } from '$lib/router/router.types'

import { router } from '$lib/router/router.svelte.js'
import { routes } from '$lib/routes'
import { DEV } from 'esm-env'

export const prerender = true

export const load = async ({ url, locals }) => {
	const path = url.pathname as ExtractPaths<typeof routes>

	const title = path === '/' ? 'Home' : (router.get(path)?.title ?? '404')

	// Filter out dev routes if not in dev mode.
	const all_routes = filterDevRoutes(routes)

	return {
		title,
		routes: all_routes,
		theme: locals.theme,
	}
}

/**
 * Recursively filters out dev routes from the route structure in production.
 */
function filterDevRoutes(routes: readonly Route[]): readonly Route[] {
	if (DEV) return routes

	return routes
		.filter(route => DEV || route.dev !== true)
		.map(route => ({
			...route,
			children: route.children ? filterDevRoutes(route.children) : [],
		}))
}
