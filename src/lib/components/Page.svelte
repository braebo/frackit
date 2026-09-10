<script lang="ts">
	import type { Snippet } from 'svelte'

	import { IN } from '$lib/utils/transitions'
	import { fly } from 'svelte/transition'
	import { router } from '$lib/router'

	let {
		title = router.current.title,
		before,
		after,
		children,
	}: {
		title?: string | false
		before?: Snippet
		after?: Snippet
		children?: Snippet
	} = $props()
</script>

<div class="page">
	{@render before?.()}

	<div class="page-content">
		{#if title}
			<h1 class="page-title">{title}</h1>
		{/if}

		<div class="content-inner" in:fly|global={{ ...IN, y: 7.5, duration: 750 }}>
			{@render children?.()}
		</div>
	</div>

	{@render after?.()}
</div>

<style lang="scss">
	.page {
		position: relative;

		display: flex;
		flex-direction: column;
		gap: var(--gap);

		width: 100%;
		max-width: 100%;
	}

	.page-content {
		width: 100%;
		max-width: min(var(--page-width), calc(100vw - var(--padding-inset)));
		margin: 0 auto;
	}

	.page-title {
		view-transition-name: page-title;

		height: fit-content;
		margin-left: -1.25rem;

		clip-path: inset(0 0 0 0);
		filter: blur(0);
	}

	@media screen and (max-width: 831px) {
		.page-title {
			// margin-left: -1rem;
			margin-left: 0rem;
		}
	}

	::view-transition-new(page-title) {
		animation: in 0.4s cubic-bezier(0.77, 0, 0.175, 1) forwards;
	}
	::view-transition-old(page-title) {
		animation: out 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
	}

	@keyframes in {
		from {
			clip-path: inset(100% 0 0 0);
			transform: translateY(-50%);
		}
		to {
			clip-path: inset(0 0 0 0);
			transform: translateY(0);
		}
	}

	@keyframes out {
		from {
			clip-path: inset(0 0 0 0);
			transform: translateY(0);
		}
		to {
			clip-path: inset(100% 0 0 0);
			transform: translateY(10%);
		}
	}
</style>
