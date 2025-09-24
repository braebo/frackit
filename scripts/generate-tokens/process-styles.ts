import type { TokenData, TokenMap, TokenType, DroppedCategory } from './types'
import type { Dirent } from 'node:fs'

import { readdir, readFile } from 'node:fs/promises'
import { basename, join, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { TOKEN_TYPES } from './types'

import scssSyntax from 'postcss-scss'

const ROOT_DIR = fileURLToPath(new URL(process.cwd(), import.meta.url))

const STYLES_DIR = join(ROOT_DIR, 'src', 'styles')
const SCSS_EXTENSION = '.scss'

const parseScssRoot = (filePath: string, content: string) =>
	(scssSyntax as any).parse(content, { from: filePath }) as import('postcss').Root

const extractCustomPropertiesFromRoot = (root: import('postcss').Root): TokenData => {
	const seen = new Set<string>()
	const out: TokenData = {}
	root.walkDecls(decl => {
		if (!decl.prop || !decl.prop.startsWith('--')) return
		const name = decl.prop.trim()
		if (seen.has(name)) return
		seen.add(name)
		out[name] = String(decl.value).trim().replace(/\s+/g, ' ')
	})
	return out
}

const extractUtilityDeclarationsFromRoot = (root: import('postcss').Root): Map<string, TokenData> => {
	const map = new Map<string, TokenData>()

	root.walkRules(rule => {
		if (rule.parent && rule.parent.type !== 'root') return
		if (!rule.selector) return

		const selectors = rule.selector
			.split(',')
			.map(s => s.trim())
			.filter(Boolean)
		for (const sel of selectors) {
			if (!/^\.[a-zA-Z0-9_-]+$/.test(sel)) continue
			const name = sel.slice(1)
			if (!map.has(name)) map.set(name, {})
			const decls = map.get(name)!
			rule.each(node => {
				if (node.type !== 'decl') return
				const prop = (node as import('postcss').Declaration).prop
				const val = (node as import('postcss').Declaration).value
				if (!prop) return
				decls[prop] = String(val)
			})
		}
	})

	return map
}

const summarizeDropped = (name: string, root: import('postcss').Root, path: string): DroppedCategory => {
	// Selection colors
	const selectionDecls: Record<string, string> = {}
	root.walkRules(rule => {
		if (!rule.selector) return
		if (rule.selector.includes('::selection') || rule.selector.includes('::focus-text')) {
			rule.walkDecls(d => {
				selectionDecls[d.prop] = String(d.value)
			})
		}
	})
	if (Object.keys(selectionDecls).length > 0) {
		const bg = selectionDecls['background'] || selectionDecls['background-color']
		const color = selectionDecls['color']
		const details = [bg ? `bg: ${bg}` : null, color ? `color: ${color}` : null].filter(Boolean).join(', ')
		return { name, reason: 'selection styling', details, path }
	}

	// View transitions
	let hasViewTransitions = false
	root.walkRules(rule => {
		if (
			rule.selector &&
			(rule.selector.includes('::view-transition-old') || rule.selector.includes('::view-transition-new'))
		) {
			hasViewTransitions = true
		}
	})
	if (!hasViewTransitions) {
		root.walkAtRules(at => {
			if (at.name === 'view-transition') hasViewTransitions = true
		})
	} else {
		return { name, reason: 'view transitions config', details: 'uses ::view-transition-* selectors', path }
	}

	// Code/pre styling
	let hasCode = false
	let preCount = 0
	root.walkRules(rule => {
		if (!rule.selector) return
		if (/(^|,|\s)(pre|code|:not\(pre\)\s*>\s*code)(\s|,|$)/.test(rule.selector)) {
			hasCode = true
			preCount += 1
		}
	})
	if (hasCode) {
		return { name, reason: 'code block styling', details: `rules: ${preCount}`, path }
	}

	// Resets
	let hasReset = false
	root.walkRules(rule => {
		if (!rule.selector) return
		if (rule.selector.includes('*') || rule.selector.includes('html') || rule.selector.includes('body')) {
			hasReset = true
		}
	})
	if (hasReset) {
		return { name, reason: 'global reset/normalization', path }
	}

	return { name, reason: 'no tokens/utilities detected', path }
}

const formatUtilityDeclarations = (decls: TokenData): string =>
	Object.entries(decls)
		.map(([prop, val]) => `${prop}: ${val};`)
		.join('\n')

const buildCategoryName = (baseName: string, type: TokenType): string => `${baseName}/${type}`

const isScssFile = (entry: Dirent): boolean => entry.isFile() && extname(entry.name) === SCSS_EXTENSION

const SOURCE_ONLY_FILES = new Set(['reset'])

export const processStyles = async (): Promise<{ tokens: TokenMap; dropped: DroppedCategory[] }> => {
	const entries = await readdir(STYLES_DIR, { withFileTypes: true })

	const tokens: TokenMap = {}
	const dropped: DroppedCategory[] = []

	for (const entry of entries.filter(isScssFile)) {
		const filePath = join(STYLES_DIR, entry.name)
		const fileContent = await readFile(filePath, 'utf8')

		const root = parseScssRoot(filePath, fileContent)

		const baseName = basename(entry.name, SCSS_EXTENSION)
		const customProperties = extractCustomPropertiesFromRoot(root)
		const utilityDeclarations = extractUtilityDeclarationsFromRoot(root)

		let categoriesCreated = 0

		if (Object.keys(customProperties).length > 0) {
			const name = buildCategoryName(baseName, TOKEN_TYPES.CUSTOM_PROPERTIES)
			tokens[name] = {
				type: TOKEN_TYPES.CUSTOM_PROPERTIES,
				data: customProperties,
			}
			categoriesCreated += 1
		}

		if (utilityDeclarations.size > 0) {
			const name = buildCategoryName(baseName, TOKEN_TYPES.UTILITIES)
			const data: TokenData = {}
			for (const [utilityName, declarations] of utilityDeclarations) {
				data[`.${utilityName}`] = formatUtilityDeclarations(declarations)
			}
			tokens[name] = {
				type: TOKEN_TYPES.UTILITIES,
				data,
			}
			categoriesCreated += 1
		}

		if (categoriesCreated === 0) {
			if (SOURCE_ONLY_FILES.has(baseName)) {
				const name = buildCategoryName(baseName, TOKEN_TYPES.SOURCE)
				tokens[name] = {
					type: TOKEN_TYPES.SOURCE,
					data: {
						source: fileContent,
					},
				}
				continue
			}

			dropped.push(summarizeDropped(baseName, root, filePath))
		}
	}

	return { tokens, dropped }
}
