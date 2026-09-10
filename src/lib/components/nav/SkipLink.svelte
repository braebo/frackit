<!--@component
Accessibility helper component to skip to the main content
-->
<script lang="ts">
	import type { Snippet } from 'svelte'

	let { href, children }: { href: string; children?: Snippet } = $props()
</script>

<a {href}>
	{#if children}{@render children()}{:else}Skip to main content{/if}
</a>

<style>
	a {
		position: absolute;
		display: flex;
		align-items: center;

		height: calc(var(--nav-height) - 1.25rem);
		padding: 0 0.5rem;

		background: var(--bg-a);
		color: inherit;

		font: var(--font-ui-md);

		inset-block-start: 0.5rem;
		inset-inline-start: 0.5rem;
		transform: translateY(-999px);

		z-index: 1000; /* 1 more than the banner z-index */
	}

	a:focus {
		transform: translateY(0%);
	}
</style>
