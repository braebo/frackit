/**
 * @fileoverview Types for the generate-tokens script.
 *
 * Dev Notes:
 *
 * TODO: Update the script, primarily `cli.ts` and `process-styles.ts`, to implement this new refactor described below.
 *
 * I've just finished re-thinking the structure of this script's data handling.  Here is the previous version, which the current `cli` and `process-styles` files use:
 *
 * ```ts
 * export type PropertyKey = string
 * export type PropertyValue = string | number | boolean | null | undefined
 *
 * export type CustomProperties = Record<PropertyKey, PropertyValue>
 *
 * export type UtilityToken = {
 * 	name: string
 * 	declarations: Record<string, string>
 * }
 *
 * export type TokenCategory = {
 * 	customProperties: CustomProperties
 * 	utilities: UtilityToken[]
 * }
 *
 * export type TokenDictionary = Record<string, TokenCategory>
 * ```
 *
 * This structure results in lots of empty objects in the output JSON file.
 *
 * The new structure allows for more effective parsing and UI generation with an explicit switch on the `type` property.
 *
 * This file contains the new refactored types for the next iteration of the script.
 */

export type PropertyKey = string
export type PropertyValue = string | number | boolean | null | undefined

// // These types are nice and simple, but they can't contain doc comments like a good ole' POJO.  This can likely be deleted.
// export type TokenType = (typeof TOKEN_TYPES)[number]
// export const TOKEN_TYPES = ['CUSTOM_PROPERTIES', 'UTILITIES', 'SOURCE'] as const

export type TokenType = (typeof TOKEN_TYPES)[keyof typeof TOKEN_TYPES]
export const TOKEN_TYPES = {
	/** A key/value pair of custom properties. */
	CUSTOM_PROPERTIES: 'CUSTOM_PROPERTIES',
	/** A key/value pair of utility classes. */
	UTILITIES: 'UTILITIES',
	/**
	 * The source file that the token was extracted from.
	 * TODO: As of now, I've only considered the reset.scss file using this type.  That should be updated, but we should remain open to other dropped files that may be a good fit for this type as well.
	 * TODO: This can be displayed as scss on '/src/routes/design/tokens/+page.svelte' and highlighted with this apps SampleKit Shiki preprocessor support in .svelte files.
	 */
	SOURCE: 'SOURCE',
}

export interface TokenData {
	[key: PropertyKey]: PropertyValue
}

export type TokenCategory = {
	type: TokenType
	data: TokenData
}

export type TokenCategoryName = string

export type TokenMap = Record<TokenCategoryName, TokenCategory>

export type DroppedCategory = {
	name: string
	reason: string
	details?: string
	path: string
}
