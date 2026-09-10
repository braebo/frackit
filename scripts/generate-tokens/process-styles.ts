import type {
	CustomPropertiesTokenData,
	CustomPropertyName,
	DroppedCategory,
	TokenMap,
	UtilitiesTokenData,
	UtilityClassName,
} from './types'
import type { Dirent } from 'node:fs'

import { readdir, readFile } from 'node:fs/promises'
import { basename, join, extname } from 'node:path'
import { TOKEN_TYPES } from './types'

import scssSyntax from 'postcss-scss'

const ROOT_DIR = process.cwd()

const STYLES_DIR = join(ROOT_DIR, 'src', 'styles')
const SCSS_EXTENSION = '.scss'

const parseScssRoot = (filePath: string, content: string) =>
	(scssSyntax as any).parse(content, { from: filePath }) as import('postcss').Root

const isCustomPropertyName = (value: string): value is CustomPropertyName => value.startsWith('--')

const isUtilityClassName = (value: string): value is UtilityClassName => value.startsWith('.')

const extractCustomPropertiesFromRoot = (root: import('postcss').Root): CustomPropertiesTokenData => {
	const seen = new Set<CustomPropertyName>()
	const out: Partial<CustomPropertiesTokenData> = {}
	root.walkDecls(decl => {
		if (!decl.prop || !decl.prop.startsWith('--')) return
		const name = decl.prop.trim()
		if (!isCustomPropertyName(name)) return
		if (seen.has(name)) return
		seen.add(name)
		out[name] = String(decl.value).trim().replace(/\s+/g, ' ')
	})
	return out as CustomPropertiesTokenData
}

type RawUtilityDeclarations = Record<string, string>

const extractUtilityDeclarationsFromRoot = (root: import('postcss').Root): Map<string, RawUtilityDeclarations> => {
	const map = new Map<string, RawUtilityDeclarations>()

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

const buildCategoryName = (baseName: string): string => baseName

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
			const name = buildCategoryName(baseName)
			tokens[name] = {
				type: TOKEN_TYPES.CUSTOM_PROPERTIES,
				data: customProperties,
			}
			categoriesCreated += 1
		}

		if (utilityDeclarations.size > 0) {
			const name = buildCategoryName(baseName)
			const data: Partial<UtilitiesTokenData> = {}
			for (const [utilityName, declarations] of utilityDeclarations) {
				const className = `.${utilityName}`
				if (!isUtilityClassName(className)) continue
				data[className] = declarations
			}
			tokens[name] = {
				type: TOKEN_TYPES.UTILITIES,
				data: data as UtilitiesTokenData,
			}
			categoriesCreated += 1
		}

		if (categoriesCreated === 0) {
			if (SOURCE_ONLY_FILES.has(baseName)) {
				const name = buildCategoryName(baseName)
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
