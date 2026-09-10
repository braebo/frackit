<script lang="ts">
	import Page from '$lib/components/Page.svelte'
	import { router } from '$lib/router'
</script>

<Page title="Playground">
	<div class="br-lg"></div>

	<div class="playground">
		{#each router.current.children ?? [] as child}
			<div>
				<a href={child.path}>{child.title}</a>
			</div>
		{/each}
	</div>
</Page>

<style lang="scss">
	.playground {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
	}

	a {
		font-size: var(--font-lg);
	}
</style>
