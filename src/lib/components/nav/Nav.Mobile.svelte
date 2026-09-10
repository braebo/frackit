<!-- @component
Top navigation bar for the application. It provides a slot for the left side, the right side, and the center.
-->

<script lang="ts">
	import { router, type Route } from '$lib/router'

	import ThemeSwitch from '$lib/components/ThemeSwitch.svelte'
	import Burger from '../header/navs/Mobile/Burger.svelte'
	// import MobileMenuCool from './MobileMenuCool.svelte'
	import { Logger } from '$lib/utils/logger/logger'
	import { nav_state } from './nav_state.svelte'
	import MobileMenu from './MobileMenu.svelte'
	import { tick, untrack } from 'svelte'
	import { page } from '$app/state'
	import { r } from '@braebo/ansi'

	const log = new Logger('Nav.Mobile', { fg: 'tomato' })

	let {
		links,
		title,
	}: {
		links: readonly Route[]
		title: string | undefined
	} = $props()

	let current = $state<Route>()
	let menu_button: HTMLButtonElement | undefined

	$effect(() => {
		log.group('$effect')
		log.info((nav_state.open ? 'disabling' : 'enabling') + ' root scroll')
		if (nav_state.open) {
			// Disable root from scrolling.
			document.documentElement.style.overflow = 'hidden'
			document.documentElement.style.scrollbarGutter = 'stable'
			document.body.style.overflow = 'hidden'

			// Move up 1 level for deeper routes.
			if (page.url.pathname.split('/').length > 1) {
				const parent = router.getParent(router.current?.path ?? '/')
				if (parent) {
					log.info(`UPDATE ${r('current')}:`, parent)
					current = parent
				}
			}
		} else {
			// Enable root to scroll.
			document.documentElement.style.overflow = ''
			document.documentElement.style.scrollbarGutter = ''
			document.body.style.overflow = ''
		}
		log.groupEnd()
	})
</script>

<svelte:window
	onkeydown={e => {
		// We only manage focus when Esc is hit, otherwise the navigation will reset focus.
		if (nav_state.open && e.key === 'Escape') {
			nav_state.open = false
			tick().then(() => menu_button?.focus())
		}
	}}
/>

{#if title}
	<div class="current-section mobile">
		{title}
	</div>
{/if}

<div class="mobile mobile-menu">
	<ThemeSwitch />

	<button
		bind:this={menu_button}
		aria-label="Toggle menu"
		aria-expanded={nav_state.open}
		class="menu-toggle raised icon"
		class:open={nav_state.open}
		onclick={() => {
			nav_state.open = !nav_state.open

			if (nav_state.open) {
				current = router.current
			}
		}}
	>
		<!-- <Icon name={nav_state.open ? 'close' : 'menu'} size={24} /> -->
		<Burger bind:showMenu={nav_state.open} />
	</button>
</div>

{#if nav_state.open}
	<div class="mobile">
		<MobileMenu {links} {current} onclose={() => (nav_state.open = false)} />
		<!-- <MobileMenuCool {links} {current} onclose={() => (nav_state.open = false)} /> -->
	</div>
{/if}

<style lang="scss">
	.mobile-menu {
		display: flex;
		flex: 1;
		justify-content: end;
		align-items: center;
		gap: calc(var(--padding) * 2);

		z-index: 100;
	}

	button.menu-toggle {
		padding: calc(var(--padding) / 2);
		overflow: hidden;
		background: var(--bg-a);
	}

	.current-section {
		color: var(--theme-a);
	}

	.current-section {
		display: flex;
		align-items: center;
		color: inherit;
		margin-left: 0.25rem;
		font-size: 1rem;
	}

	@media (min-width: 832px) {
		.mobile {
			display: none;
		}
	}
</style>
