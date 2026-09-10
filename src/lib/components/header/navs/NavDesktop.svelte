<script lang="ts">
	import { fly } from 'svelte/transition'
	import { routes } from '$lib/routes'
	import { page } from '$app/state'
</script>

<nav>
	<ul>
		{#each routes as { title, path }, i}
			<li
				class:active={page.url.pathname === path}
				style:animation-delay={`${Object.keys(routes).length * 0.1 - (i % 2) * 0.1}s`}
				out:fly|global={{ y: -20, duration: 300 }}
			>
				<a data-sveltekit-prefetch href={path}>{title}</a>
			</li>
		{/each}
	</ul>
</nav>

<style lang="scss">
	nav {
		position: absolute;
		inset: 0;

		display: flex;
		justify-content: center;

		// pointer-events: none;
	}

	ul {
		display: flex;
		gap: 1.875rem;

		z-index: 1;
	}

	li {
		list-style: none;

		width: 2.5rem;

		color: var(--fg-a);
		opacity: 0;
		transform: translateY(-5px);
		animation: fly 2s cubic-bezier(0.23, 1, 0.32, 1) 0.1s forwards;
	}
	@keyframes fly {
		from {
			opacity: 0;
			transform: translateY(-5px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	a {
		display: flex;
		align-items: center;
		justify-content: center;

		height: 100%;

		color: currentColor;

		font-size: var(--font);
		font-variation-settings:
			'wght' 500,
			'wdth' 97;
		text-transform: uppercase;
		text-decoration: none;

		transition: 0.2s;
		pointer-events: all;
	}

	a:hover {
		text-decoration: none;

		font-variation-settings:
			'wght' 700,
			'wdth' 94.66;
	}

	.active {
		color: var(--theme-a);
		a {
			font-variation-settings:
				'wght' 700,
				'wdth' 94.66;
		}
	}
</style>
