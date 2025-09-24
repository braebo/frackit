import { readFile, writeFile, readdir } from 'node:fs/promises'
import { l, c, d, err, g, m, r, y } from '@braebo/ansi'
import { join, relative } from 'node:path'

const DRY = true
const MULTIPLY_BY = 1.6
const START_DIR = process.argv[2] || '.'
const EXCLUDE = ['node_modules', 'dist', 'build', '.git', '.svelte-kit', 'scripts']
const REM_REGEX = /(\d*\.?\d+)rem\b/g

const isExcluded = (path: string): boolean => EXCLUDE.some(excluded => path.includes(excluded))

async function* findFiles(dir: string): AsyncGenerator<string> {
	const entries = await readdir(dir, { withFileTypes: true })

	for (const entry of entries) {
		const fullPath = join(dir, entry.name)

		if (isExcluded(fullPath)) continue

		if (entry.isDirectory()) {
			yield* findFiles(fullPath)
		} else if (/\.(css|scss|svelte|ts|js|jsx|tsx)$/.test(entry.name)) {
			yield fullPath
		}
	}
}

function processContent(content: string): {
	result: string
	changes: Array<{ old: string; new: string }>
} {
	const changes: Array<{ old: string; new: string }> = []

	const result = content.replace(REM_REGEX, (match, num) => {
		const newValue = (parseFloat(num) * MULTIPLY_BY).toFixed(2)
		const newMatch = `${newValue}rem`
		changes.push({ old: match, new: newMatch })
		return newMatch
	})

	return { result, changes }
}

async function processFile(filepath: string): Promise<void> {
	const content = await readFile(filepath, 'utf-8')
	const { result, changes } = processContent(content)

	if (changes.length > 0) {
		if (DRY) {
			l()
			l(d(relative(START_DIR, filepath)))

			changes.forEach(({ old, new: newVal }) => {
				l(`  ${d(m(old))} ${d('->')} ${c(newVal)}`)
			})
		} else {
			await writeFile(filepath, result)
		}

		l(d(`  ${g(changes.length)} changes`))
	}
}

async function main() {
	l(`${DRY ? y('DRY') : r('LIVE')} run`)

	try {
		for await (const file of findFiles(START_DIR)) {
			await processFile(file)
		}

		l('\nCompleted successfully!')
	} catch (error) {
		err('\nError:', error)
	}
}

main()
