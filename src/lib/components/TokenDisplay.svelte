<script lang="ts">
	import type { TokenMap } from '../../../scripts/generate-tokens/types'

	let { tokens }: { tokens: TokenMap } = $props()

	const categories = $derived(Object.entries(tokens))
</script>

<div class="token-display">
	<h2>Design Tokens</h2>

	{#each categories as [categoryName, category]}
		<section class="token-category">
			<header class="category-header">
				<h3>{categoryName}</h3>
				<span class="category-type">{category.type}</span>
			</header>

			<div class="category-content">
				{#if category.type === 'CUSTOM_PROPERTIES'}
					<div class="custom-properties">
						{#each Object.entries(category.data) as [propName, propValue]}
							<div class="property-item">
								<code class="property-name">{propName}</code>
								<div class="property-value">
									<code>{propValue}</code>
									{#if propName.includes('color') || propName.includes('bg')}
										<div
											class="color-swatch"
											style="background-color: var({propName})"
											aria-hidden="true"
										></div>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				{:else if category.type === 'UTILITIES'}
					<div class="utilities">
						{#each Object.entries(category.data) as [className, cssProps]}
							<div class="utility-item">
								<code class="utility-name">{className}</code>
								<div class="css-properties">
									{#each Object.entries(cssProps) as [prop, value]}
										<div class="css-property">
											<span class="css-prop">{prop}:</span>
											<span class="css-value">{value};</span>
										</div>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				{:else if category.type === 'SOURCE'}
					<div class="source-content">
						<details>
							<summary>View Source SCSS</summary>
							<!-- <pre class="source-code"><code>{category.data.source}</code></pre> -->
							<!-- shiki-start
  ```scss
  {category.data.source}
  ```
shiki-end -->
						</details>
					</div>
				{/if}
			</div>
		</section>
	{/each}
</div>

<style>
	.token-display {
		display: flex;
		flex-direction: column;
		gap: var(--gap);
		max-width: 100%;
	}

	h2 {
		font: var(--font-h2);
		margin-bottom: var(--gap);
	}

	.token-category {
		background: var(--bg-a);
		border: 1px solid var(--border-a);
		border-radius: var(--radius);
		overflow: hidden;
	}

	.category-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--padding);
		background: var(--bg-b);
		border-bottom: 1px solid var(--border-a);
	}

	.category-header h3 {
		font: var(--font-h3);
		margin: 0;
	}

	.category-type {
		font-size: var(--font-xs);
		color: var(--text-c);
		background: var(--bg-c);
		padding: 0.156rem 0.313rem;
		border-radius: var(--radius-sm);
		font-family: var(--font-m);
	}

	.category-content {
		padding: var(--padding);
	}

	.custom-properties {
		display: grid;
		gap: 0.469rem;
	}

	.property-item {
		display: grid;
		grid-template-columns: minmax(200px, max-content) 1fr;
		gap: var(--padding);
		align-items: center;
		padding: 0.313rem;
		background: var(--bg-b);
		border-radius: var(--radius-sm);
	}

	.property-name {
		font-family: var(--font-m);
		font-size: var(--font-xs);
		color: var(--text-b);
		background: var(--bg-c);
		padding: 0.156rem 0.313rem;
		border-radius: var(--radius-sm);
		word-break: break-all;
	}

	.property-value {
		display: flex;
		align-items: center;
		gap: 0.313rem;

		code {
			font-family: var(--font-m);
			font-size: var(--font-xs);
			color: var(--text-a);
		}
	}

	.color-swatch {
		width: 1rem;
		height: 1rem;
		border-radius: var(--radius-sm);
		border: 1px solid var(--border-a);
		flex-shrink: 0;
	}

	.utilities {
		display: grid;
		gap: 0.5rem;
	}

	.utility-item {
		background: var(--bg-b);
		border-radius: var(--radius-sm);
		padding: var(--padding);
	}

	.utility-name {
		font-family: var(--font-m);
		font-size: var(--font-sm);
		color: var(--text-b);
		background: var(--bg-c);
		padding: 0.156rem 0.313rem;
		border-radius: var(--radius-sm);
		display: inline-block;
		margin-bottom: 0.313rem;
	}

	.css-properties {
		display: grid;
		gap: 0.156rem;
		margin-left: 0.5rem;
	}

	.css-property {
		font-family: var(--font-m);
		font-size: var(--font-xs);

		.css-prop {
			color: var(--text-c);
		}

		.css-value {
			color: var(--text-a);
			margin-left: 0.313rem;
		}
	}

	.source-content {
		details {
			summary {
				cursor: pointer;
				font-weight: 500;
				padding: 0.313rem;
				background: var(--bg-b);
				border-radius: var(--radius-sm);

				&:hover {
					background: var(--bg-c);
				}
			}
		}
	}

	@media (max-width: 768px) {
		.property-item {
			grid-template-columns: 1fr;
			gap: 0.313rem;
		}

		.property-name {
			justify-self: start;
		}
	}
</style>
