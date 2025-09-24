/// <reference types="bun-types" />

import type { DroppedCategory, TokenMap } from './types'
import { TOKEN_TYPES } from './types'

import { l, d, c, p, n, CLEAR, r, bd } from '@braebo/ansi'
import { processStyles } from './process-styles'

import { join, relative } from 'node:path'

const OUTPUT_PATH = join(process.cwd(), 'src/routes/design/tokens/tokens.json')

/** Logger prefix. */
const P = p('|')

export type CategorySummary = {
	name: string
	customProperties: number
	utilities: number
	source: boolean
}

function summarizeTokenCategories(tokens: TokenMap): CategorySummary[] {
	const summaryMap = new Map<string, CategorySummary>()

	for (const [name, category] of Object.entries(tokens)) {
		const slashIndex = name.indexOf('/')
		const baseName = slashIndex === -1 ? name : name.slice(0, slashIndex)
		let summary = summaryMap.get(baseName)
		if (!summary) {
			summary = { name: baseName, customProperties: 0, utilities: 0, source: false }
			summaryMap.set(baseName, summary)
		}

		switch (category.type) {
			case TOKEN_TYPES.CUSTOM_PROPERTIES: {
				summary.customProperties = Object.keys(category.data).length
				break
			}
			case TOKEN_TYPES.UTILITIES: {
				summary.utilities = Object.keys(category.data).length
				break
			}
			case TOKEN_TYPES.SOURCE: {
				summary.source = true
				break
			}
		}
	}

	return Array.from(summaryMap.values())
}

const main = async (): Promise<void> => {
	const { tokens, dropped } = await processStyles()

	const summaries = ensureReasonableOutput(tokens)

	const json = JSON.stringify(tokens, null, 2)

	try {
		await Bun.write(OUTPUT_PATH, json)
	} catch (_e) {
		l(P)
		l(P, d('Note: could not write tokens.json in this environment.'))
	}

	printCategoryTables({ summaries, dropped })
}

// TODO: Move this to its own file.
export function printCategoryTables({ summaries, dropped }: { summaries: CategorySummary[]; dropped: DroppedCategory[] }) {
	const counts = summaries.map(({ name, customProperties, utilities, source }) => ({
		name,
		customProperties: customProperties === 0 ? d('-') : customProperties,
		utilities: utilities === 0 ? d('-') : utilities,
		source: source ? c('✓') : d('-'),
	}))

	l(P)
	l(P, 'Generated', c('tokens.json'), '-', d(relative(process.cwd(), OUTPUT_PATH)))
	l(P)
	console.table(counts)

	if (dropped.length > 0) {
		l(P)
		l(P, 'Dropped categories (no tokens/utilities):')
		l(P)
		const rows = dropped.map(({ name, reason, details, path }) => ({
			name,
			reason,
			details: details ?? '-',
			path: relative(process.cwd(), path),
		}))
		console.table(rows)
	}

}

function ensureReasonableOutput(tokens: TokenMap): CategorySummary[] {
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

try {
	n()
	l(p(''))
	l(P + p(d(bd(' generate:tokens '))))
	await main()
} catch (e) {
	l(CLEAR)
	l(P + r(bd(' ERROR '), d(e.message)))
	// l(PRFX)
	n()
	console.error(e)
} finally {
	l(P)
	l(P + p(d(bd(' generate:tokens '))))
	l(p('↵'))
}
