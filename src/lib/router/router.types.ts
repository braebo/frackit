// todo - this will break if sveltekit changes this file again... should write a test or something.
import ROUTES from '../../../.svelte-kit/types/route_meta_data.json'

export type Route = {
	path: string
	title: string
	children?: Route[]
	/**
	 * Whether the route is only reachable during development.
	 * @default false
	 */
	dev?: boolean
}

export type ExtractPaths<T extends Route[]> = T extends readonly (infer R)[]
	? R extends { path: string; children?: Route[] }
		? R['path'] | (R['children'] extends Route[] ? ExtractPaths<R['children']> : never)
		: never
	: never

export type GetRouteByPath<T extends Route[], P extends ExtractPaths<T>> = T extends readonly (infer R)[]
	? R extends { path: P; title: string }
		? R
		: R extends { children: Route[] }
			? GetRouteByPath<R['children'], P>
			: never
	: never

/**
 * Strips SvelteKit layout group syntax from paths.
 * @example
 * ```ts
 * StripLayoutGroups<'/(dev)/foo/bar'> // '/foo/bar'
 * ```
 */
type StripLayoutGroups<T extends string> = T extends `${infer Before}(${string})/${infer After}`
	? StripLayoutGroups<`${Before}${After}`>
	: T extends `${infer Before}(${string})`
		? Before
		: T

/**
 * A flat array of all valid paths from the ROUTES object.
 */
type ValidPaths = StripLayoutGroups<keyof typeof ROUTES>

/**
 * Validates a path by stripping layout groups first.
 * @example
 * ```ts
 * ValidatePath<'/(dev)/foo/bar'> // true
 * ```
 */
type ValidatePath<P extends string> = StripLayoutGroups<P> extends ValidPaths ? true : false

// Provides type validation for routes.
export function validateRoutes<const T extends readonly Route[]>(
	routes: T & {
		readonly [K in keyof T]: T[K] extends { path: infer P }
			? P extends string
				? ValidatePath<P> extends true
					? T[K]
					: // prettier-ignore
						{ error: `Path "${StripLayoutGroups<P> & string}" (stripped from "${P & string}") is not a valid route in ROUTES` }
				: T[K]
			: T[K]
	},
): T {
	return routes
}
