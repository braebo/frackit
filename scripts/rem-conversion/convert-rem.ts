#!/usr/bin/env bun

/**
 * Script to convert all rem values in the codebase by multiplying them by 0.625.
 * 
 * Searches for rem values in *.scss, *.css, *.svelte, *.ts, *.js files
 * and converts them by multiplying the numeric value by 0.625.
 */

import { promises as fs } from 'fs'
import path from 'path'

const MULTIPLIER = 0.625
const FILE_EXTENSIONS = ['scss', 'css', 'svelte', 'ts', 'js']

/**
 * Round a number to a reasonable precision for CSS values.
 */
function roundToPrecision(num: number, precision: number = 3): number {
	const factor = Math.pow(10, precision)
	return Math.round(num * factor) / factor
}

/**
 * Convert rem values in text by multiplying by the given multiplier.
 * This function avoids converting rem values inside comments and strings.
 */
function convertRemValues(content: string): { content: string; changes: number } {
	let changes = 0
	
	// Split content into tokens to avoid processing strings and comments
	const lines = content.split('\n')
	const processedLines = lines.map(line => {
		// Skip lines that are primarily comments (starting with // or /* or *)
		const trimmed = line.trim()
		if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
			return line
		}
		
		// For non-comment lines, be more careful about strings
		// This is a simple approach that works for most CSS/SCSS/Svelte cases
		let processedLine = line
		
		// Match patterns like: 1rem, 1.5rem, 0.25rem, 10.123rem
		// Only in contexts that look like CSS property values
		const remPattern = /(\d+(?:\.\d+)?)rem\b/g
		
		// First, handle inline comments by only processing the part before the comment
		const inlineCommentIndex = line.indexOf('/*')
		let codePartToProcess = line
		let commentPart = ''
		
		if (inlineCommentIndex !== -1) {
			codePartToProcess = line.substring(0, inlineCommentIndex)
			commentPart = line.substring(inlineCommentIndex)
		}
		
		// Check if the code part contains quoted strings
		const hasQuotes = /['"`]/.test(codePartToProcess)
		
		if (!hasQuotes) {
			// Safe to process the code part
			const processedCodePart = codePartToProcess.replace(remPattern, (match, numStr) => {
				const originalValue = parseFloat(numStr)
				const newValue = roundToPrecision(originalValue * MULTIPLIER)
				changes++
				
				console.log(`  ${originalValue}rem → ${newValue}rem`)
				
				return `${newValue}rem`
			})
			processedLine = processedCodePart + commentPart
		} else {
			// More complex handling for lines with quotes
			// Split by quotes and only process non-quoted parts
			const parts: string[] = []
			let inQuote = false
			let quoteChar = ''
			let currentPart = ''
			
			for (let i = 0; i < codePartToProcess.length; i++) {
				const char = codePartToProcess[i]
				
				if (!inQuote && (char === '"' || char === "'" || char === '`')) {
					// Entering a quote
					if (currentPart) {
						// Process the non-quoted part
						parts.push(currentPart.replace(remPattern, (match, numStr) => {
							const originalValue = parseFloat(numStr)
							const newValue = roundToPrecision(originalValue * MULTIPLIER)
							changes++
							console.log(`  ${originalValue}rem → ${newValue}rem`)
							return `${newValue}rem`
						}))
					}
					inQuote = true
					quoteChar = char
					currentPart = char
				} else if (inQuote && char === quoteChar && codePartToProcess[i - 1] !== '\\') {
					// Exiting a quote
					currentPart += char
					parts.push(currentPart) // Don't process quoted content
					currentPart = ''
					inQuote = false
					quoteChar = ''
				} else {
					currentPart += char
				}
			}
			
			// Handle remaining part
			if (currentPart) {
				if (!inQuote) {
					parts.push(currentPart.replace(remPattern, (match, numStr) => {
						const originalValue = parseFloat(numStr)
						const newValue = roundToPrecision(originalValue * MULTIPLIER)
						changes++
						console.log(`  ${originalValue}rem → ${newValue}rem`)
						return `${newValue}rem`
					}))
				} else {
					parts.push(currentPart) // Don't process if we're still in a quote
				}
			}
			
			processedLine = parts.join('') + commentPart
		}
		
		return processedLine
	})
	
	return { content: processedLines.join('\n'), changes }
}

/**
 * Process a single file.
 */
async function processFile(filePath: string): Promise<void> {
	try {
		const content = await fs.readFile(filePath, 'utf8')
		const { content: newContent, changes } = convertRemValues(content)
		
		if (changes > 0) {
			await fs.writeFile(filePath, newContent, 'utf8')
			console.log(`✅ ${filePath} (${changes} changes)`)
		} else {
			console.log(`⚪ ${filePath} (no changes)`)
		}
	} catch (error) {
		console.error(`❌ Error processing ${filePath}:`, error)
	}
}

/**
 * Find all files with the specified extensions using Bun's glob.
 */
async function findFiles(): Promise<string[]> {
	const patterns = FILE_EXTENSIONS.map(ext => `**/*.${ext}`)
	const allFiles: string[] = []
	
	for (const pattern of patterns) {
		const glob = new Bun.Glob(pattern)
		for await (const file of glob.scan({
			cwd: process.cwd(),
			absolute: true,
		})) {
			// Filter out files in directories we want to ignore
			if (!file.includes('/node_modules/') &&
				!file.includes('/dist/') &&
				!file.includes('/build/') &&
				!file.includes('/.svelte-kit/') &&
				!file.includes('/.git/') &&
				!file.endsWith('bun.lock')) {
				allFiles.push(file)
			}
		}
	}
	
	// Remove duplicates and sort
	return [...new Set(allFiles)].sort()
}

/**
 * Filter files to only those that actually contain rem values.
 */
async function filterFilesWithRem(files: string[]): Promise<string[]> {
	const filesWithRem: string[] = []
	
	for (const filePath of files) {
		try {
			const content = await fs.readFile(filePath, 'utf8')
			if (/\d+(?:\.\d+)?rem\b/.test(content)) {
				filesWithRem.push(filePath)
			}
		} catch (error) {
			console.error(`Error reading ${filePath}:`, error)
		}
	}
	
	return filesWithRem
}

/**
 * Main function to run the conversion.
 */
async function main() {
	console.log('🔍 Finding files with rem values...')
	
	const allFiles = await findFiles()
	console.log(`Found ${allFiles.length} total files`)
	
	const filesWithRem = await filterFilesWithRem(allFiles)
	console.log(`Found ${filesWithRem.length} files with rem values`)
	
	if (filesWithRem.length === 0) {
		console.log('No files with rem values found.')
		return
	}
	
	console.log('\n📝 Converting rem values...')
	console.log(`Multiplying all rem values by ${MULTIPLIER}\n`)
	
	let totalChanges = 0
	
	for (const filePath of filesWithRem) {
		console.log(`\nProcessing: ${path.relative(process.cwd(), filePath)}`)
		
		const originalContent = await fs.readFile(filePath, 'utf8')
		const { changes } = convertRemValues(originalContent)
		totalChanges += changes
		
		await processFile(filePath)
	}
	
	console.log(`\n✨ Conversion complete!`)
	console.log(`Processed ${filesWithRem.length} files`)
	console.log(`Made ${totalChanges} total changes`)
}

// Run the script
if (import.meta.main) {
	main().catch(console.error)
}