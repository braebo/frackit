import type { CategorySummary } from './utilities'
import type { DroppedCategory } from './types'

import { l, d, c, p } from '@braebo/ansi'
import { relative } from 'node:path'

/** Logger prefix. */
export const P = p('|')

export function printCategoryTables({
	summaries,
	dropped,
	outputPath,
}: {
	summaries: CategorySummary[]
	dropped: DroppedCategory[]
	outputPath: string
}) {
	const counts = summaries.map(({ name, customProperties, utilities, source }) => ({
		name,
		customProperties: customProperties === 0 ? d('-') : customProperties,
		utilities: utilities === 0 ? d('-') : utilities,
		source: source ? c('✓') : d('-'),
	}))

	l(P)
	l(P, 'Generated', c('tokens.json'), '-', d(relative(process.cwd(), outputPath)))
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
