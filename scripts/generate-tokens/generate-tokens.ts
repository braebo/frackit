/// <reference types="bun-types" />

import { l, p, n, CLEAR, r, bd, d } from '@braebo/ansi'
import { ensureReasonableOutput } from './utilities'
import { printCategoryTables, P } from './output'
import { processStyles } from './process-styles'

import { dirname, join, relative } from 'node:path'

const OUTPUT_PATH = join(process.cwd(), 'src/routes/design/tokens/tokens.ts')

const main = async (): Promise<void> => {
	const { tokens, dropped } = await processStyles()

	const summaries = ensureReasonableOutput(tokens)

	printCategoryTables({ summaries, dropped, outputPath: OUTPUT_PATH })

	const relativePath = relative(dirname(OUTPUT_PATH), dirname(new URL(import.meta.url).pathname))

	const codegen = /*ts*/ `
import type { TokenMap } from '${join(relativePath, 'types.ts')}'

export const tokens = ${JSON.stringify(tokens, null, 2)} as const satisfies TokenMap`

	try {
		await Bun.write(OUTPUT_PATH, codegen.trimStart())
	} catch (_e) {
		l(P)
		l(P, d('Note: could not write tokens.json in this environment.'))
	}
}

try {
	n()
	l(p('↴'))
	l(P + p(bd(' generate:tokens ')))
	await main()
} catch (e) {
	l(CLEAR)
	l(P + r(bd(' ERROR '), d(e.message)))
	n()
	console.error(e)
} finally {
	l(P)
	l(P + p(d(bd(' generate:tokens '))))
	// l(p('↵'))
	l(p('↲'))
}
