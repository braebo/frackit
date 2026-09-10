<script lang="ts">
	import { clickOutside } from '$lib/actions/click-outside'
	import { device } from '$lib/utils/device.svelte'
	import PageFill from './Mobile/PageFill.svelte'
	import { fly, fade } from 'svelte/transition'
	import Burger from './Mobile/Burger.svelte'
	import { quintOut } from 'svelte/easing'
	import { routes } from '$lib/routes'
	import { page } from '$app/stores'

	let showMenu = $state(false)
</script>

<div
	class="burger"
	use:clickOutside={{ whitelist: ['wrapper'] }}
	onOutClick={() => (showMenu = false)}
>
	<Burger bind:showMenu />
</div>

<PageFill bind:showMenu>
	{#if showMenu}
		<nav class:showMenu class:mobile={device.mobile} class="flex">
			<ul class="col center">
				{#each routes as { path, title }, i (title)}
					{@const x = 5 * (i % 2 ? 1 : -1)}
					<li
						class:active={$page.url.pathname === path}
						in:fly|global={{ x, delay: 500, duration: 750, easing: quintOut }}
						out:fly|global={{ x, duration: 300 }}
					>
						<a onclick={() => (showMenu = false)} data-sveltekit-prefetch href={path}>
							{title}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	{/if}
</PageFill>

<style>
	.burger {
		position: fixed;
		bottom: 0.313rem;
		left: 0.156rem;

		z-index: 101;
	}

	nav {
		pointer-events: none;
	}

	ul {
		position: fixed;
		inset: 0;
		gap: 1.25rem;

		margin: auto;

		transform: translateY(-1.25rem);
		z-index: 25;
	}

	li {
		list-style: none;

		color: var(--fg-a);
	}

	a {
		display: flex;
		align-items: center;

		height: 100%;

		color: currentColor;

		font-size: var(--font-xl);
		font-weight: 700;
		text-transform: uppercase;
		text-decoration: none;
		letter-spacing: 10%;

		transition: color 0.15s linear;
		pointer-events: all;
	}

	a:hover {
		color: var(--theme-a);

		text-decoration: none;
	}

	.active {
		color: var(--theme-a);
	}
</style>
