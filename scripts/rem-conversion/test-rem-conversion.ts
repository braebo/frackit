#!/usr/bin/env bun

/**
 * Test script to verify rem conversion logic before running on the full codebase.
 */

function roundToPrecision(num: number, precision: number = 3): number {
	const factor = Math.pow(10, precision)
	return Math.round(num * factor) / factor
}

function convertRemValues(content: string): { content: string; changes: number } {
	let changes = 0
	const MULTIPLIER = 0.625
	
	// Split content into tokens to avoid processing strings and comments
	const lines = content.split('\n')
	const processedLines = lines.map(line => {
		// Skip lines that are primarily comments (starting with // or /* or *)
		const trimmed = line.trim()
		if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
			return line
		}
		
		// For non-comment lines, be more careful about strings
		let processedLine = line
		
		// Match patterns like: 1rem, 1.5rem, 0.25rem, 10.123rem
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

// Test cases
const testCases = [
	"--radius-sm: 0.3rem;",
	"--radius: 0.5rem;", 
	"--radius-lg: 1rem;",
	"--padding: 0.8rem;",
	"--gap: 2rem;",
	"--page-width: min(70rem, 100vw);",
	"margin-right: 1rem;",
	"font-size: 1.5rem;",
	"padding: 0.25rem 0.5rem;",
	"border-radius: 0.125rem;",
	"// This should not change: 1rem in comment",
	"'this should not change: 1rem in string'",
	`"this should not change: 1rem in string"`,
	"mix: 10rem solid; /* 2rem comment */",
	"height: calc(100vh - 4rem);",
]

console.log('Testing rem conversion logic:\n')

testCases.forEach((testCase, index) => {
	console.log(`Test ${index + 1}: ${testCase}`)
	const result = convertRemValues(testCase)
	console.log(`Result:   ${result.content}`)
	console.log(`Changes:  ${result.changes}`)
	console.log('---')
})