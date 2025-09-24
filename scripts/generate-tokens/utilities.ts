import type { TokenCategory, TokenMap, TokenType } from './types'
import { TOKEN_TYPES } from './types'

import { d } from '@braebo/ansi'

export type CategorySummary = {
	name: string
	customProperties: number
	utilities: number
	source: boolean
}

type CategoryDataForType = TokenCategory extends infer Category
	? Category extends { type: TokenType; data: infer Data }
		? Data
		: never
	: never

const countEntries = (data: CategoryDataForType): number => Object.keys(data).length

const buildSummaryReducer = (category: TokenCategory): ((summary: CategorySummary) => void) | null => {
	switch (category.type) {
		case TOKEN_TYPES.CUSTOM_PROPERTIES: {
			return summary => {
				summary.customProperties = countEntries(category.data)
			}
		}
		case TOKEN_TYPES.UTILITIES: {
			return summary => {
				summary.utilities = countEntries(category.data)
			}
		}
		case TOKEN_TYPES.SOURCE: {
			return summary => {
				summary.source = true
			}
		}
		default: {
			return null
		}
	}
}

export function summarizeTokenCategories(tokens: TokenMap): CategorySummary[] {
	const summaryMap = new Map<string, CategorySummary>()

	for (const [name, category] of Object.entries(tokens)) {
		const slashIndex = name.indexOf('/')
		const baseName = slashIndex === -1 ? name : name.slice(0, slashIndex)
		let summary = summaryMap.get(baseName)
		if (!summary) {
			summary = { name: baseName, customProperties: 0, utilities: 0, source: false }
			summaryMap.set(baseName, summary)
		}

		const enrichSummaryForCategory = buildSummaryReducer(category)
		if (enrichSummaryForCategory) {
			enrichSummaryForCategory(summary)
		}
	}

	return Array.from(summaryMap.values())
}

export function ensureReasonableOutput(tokens: TokenMap): CategorySummary[] {
	if (Object.keys(tokens).length === 0) {
		throw new Error('No SCSS files found in src/styles. Tokens output would be empty.')
	}

	const summaries = summarizeTokenCategories(tokens)
	const hasTokens = summaries.some(({ customProperties, utilities }) => customProperties > 0 || utilities > 0)

	if (!hasTokens) {
		throw new Error('Parsed styles but found no custom properties or utility classes.')
	}

	const badCategories = summaries.filter(
		({ customProperties, utilities, source }) => customProperties === 0 && utilities === 0 && !source,
	)

	if (badCategories.length > 0) {
		console.table(
			badCategories.map(({ name }) => ({ name, customProperties: d('-'), utilities: d('-'), source: d('-') })),
		)
		throw new Error(
			'Parser failures - Found categories with 0 tokens or utilities. Please fix the parser and try again.',
		)
	}

	return summaries
}
