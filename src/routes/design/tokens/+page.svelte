<script lang="ts">
	import TokenDisplay from '$lib/components/TokenDisplay.svelte'
	import Inspect from '$lib/components/Inspect.svelte'

	let { data } = $props()
</script>

<section class="tokens-page">
	<details class="debug-section">
		<summary>Debug: Raw Token Data</summary>
		<Inspect values={{ tokens: data.tokens }} />
	</details>

	<TokenDisplay tokens={data.tokens} />
</section>

<style lang="scss">
	.tokens-page {
		display: flex;
		flex-direction: column;
		gap: calc(var(--gap) * 2);
		width: 100%;
	}

	.debug-section {
		summary {
			cursor: pointer;

			padding: var(--padding);
			border-radius: var(--radius);

			color: var(--fg-d);
			font-size: var(--font-sm);

			&:hover {
				background: var(--bg-c);
			}
		}

		&[open] summary {
			border-bottom-left-radius: 0;
			border-bottom-right-radius: 0;
		}
	}
</style>
