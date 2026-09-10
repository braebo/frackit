/**
 * @fileoverview Types for the generate-tokens script.
 */

/**
 * Valid token data variants.
 */
export const TOKEN_TYPES = {
	/**
	 * A key/value pair of custom properties.
	 */
	CUSTOM_PROPERTIES: 'CUSTOM_PROPERTIES',
	/**
	 * A key/value pair of utility classes.
	 */
	UTILITIES: 'UTILITIES',
	/**
	 * The source code of the file associated with the category.
	 * TODO: This can be displayed as scss on '/src/routes/design/tokens/+page.svelte' and highlighted with this apps SampleKit Shiki preprocessor support in .svelte files.
	 */
	SOURCE: 'SOURCE',
} as const

export type TokenType = (typeof TOKEN_TYPES)[keyof typeof TOKEN_TYPES]

export type CustomPropertyName = `--${string}`
export type UtilityClassName = `.${string}`

export type CustomPropertiesTokenData = Record<CustomPropertyName, string>
export type UtilitiesTokenData = Record<UtilityClassName, Record<string, string>>

export interface SourceTokenData {
	source: string
}

export interface CustomPropertiesTokenCategory {
	type: typeof TOKEN_TYPES.CUSTOM_PROPERTIES
	data: CustomPropertiesTokenData
}

export interface UtilitiesTokenCategory {
	type: typeof TOKEN_TYPES.UTILITIES
	data: UtilitiesTokenData
}

export interface SourceTokenCategory {
	type: typeof TOKEN_TYPES.SOURCE
	data: SourceTokenData
}

export type TokenCategory = CustomPropertiesTokenCategory | UtilitiesTokenCategory | SourceTokenCategory

export interface TokenCategoryByType {
	[TOKEN_TYPES.CUSTOM_PROPERTIES]: CustomPropertiesTokenCategory
	[TOKEN_TYPES.UTILITIES]: UtilitiesTokenCategory
	[TOKEN_TYPES.SOURCE]: SourceTokenCategory
}

export type TokenCategoryName = string

export type TokenMap = Record<TokenCategoryName, TokenCategory>

export type TokenCategoryFor<Type extends TokenType> = TokenCategoryByType[Type]

export type TokenCategoryDataFor<Type extends TokenType> = TokenCategoryFor<Type>['data']

export type DroppedCategory = {
	name: string
	reason: string
	details?: string
	path: string
}
