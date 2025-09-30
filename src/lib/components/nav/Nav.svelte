<!-- @component
	Top navigation bar for the application. It provides a slot for the left side, the right side, and the center.
-->

<script lang="ts">
	import type { Route } from '$lib/router'

	import { nav_state } from './nav_state.svelte'
	import Logo from '../header/Logo.svelte'
	import { page } from '$app/state'

	import Mobile from './Nav.Mobile.svelte'
	import Links from './Nav.Links.svelte'
	import Menu from './Nav.Menu.svelte'

	let {
		title,
		links,
	}: {
		home_title?: string
		title: string | undefined
		links: readonly Route[]
	} = $props()

	let visible = $state(true)
</script>

<div class="nav-spacer" style="min-height: var(--nav-height)" />

<nav class:visible style:z-index={nav_state.open ? 80 : null} aria-label="Primary">
	<a class="home-link" href="/" aria-label="Home">
		<Logo active={page.url.pathname === '/'} --width="3rem" --circle="transparent" --delay="0s" />
	</a>

	<div class="desktop">
		<Links {links} />
		<Menu />
	</div>

	<Mobile {links} {title} />
</nav>

<style lang="scss">
	nav {
		// contain: layout size style;
		// view-transition-name: nav;

		position: fixed;
		display: flex;
		top: 0;
		left: 0;
		right: 0;

		width: var(--nav-width);
		height: var(--nav-height);
		margin: 0 auto;
		padding: 0 clamp(1.5rem, 2.5rem, 1.75vw);

		background-color: var(--bg-b);
		// box-shadow: 0px -4px 10px 10px rgba(0, 0, 0, 1) !important;
		// outline: 1px solid red !important;
		// outlinse-offset: -1px;
		// overflow: visible;

		user-select: none;
		// isolation: isolate;
		z-index: 101;

		&::after {
			content: '';
			position: absolute;
			left: 0;
			bottom: -4px;

			width: 100%;
			height: 4px;

			background: linear-gradient(to top, rgba(0, 0, 0, 0.05), transparent);
			z-index: -1;
			// isolation: isolate;
		}
	}

	:root.dark nav {
		background-color: var(--bg-c);

		&::after {
			background: linear-gradient(to bottom, rgba(255, 255, 255, 0.05), transparent);
		}
	}

	.home-link {
		transform: translateY(2px);
		margin-right: 1rem;
		box-shadow: none;
	}

	.desktop {
		display: none;
	}

	a {
		display: flex;
		align-items: center;
		justify-content: center;

		height: 100%;

		color: currentColor;

		text-decoration: none;

		transition: color 0.2s;
		pointer-events: all;

		&:hover {
			text-decoration: none;
		}
	}

	@media (max-width: 831px) {
		nav {
			top: unset;
			bottom: 0;
			transition: transform 0.2s;
		}

		nav:not(.visible):not(:focus-within) {
			transform: translate(0, calc(var(--nav-height)));
		}

		.home-link {
			// outline: 1px solid red;
			margin: unset;
			transform: translate(-1rem, -0.1rem);
			width: 5rem;
		}

		.nav-spacer {
			display: none;
		}
	}

	@media (min-width: 832px) {
		nav {
			display: grid;
			grid-template-columns: auto 1fr 1fr;

			&::after {
				top: auto;
				bottom: -4px;
				background: linear-gradient(to bottom, rgba(0, 0, 0, 0.05), transparent);
			}
		}

		.desktop {
			display: contents;
		}
	}

	@keyframes fade-in {
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes pop-in {
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>
