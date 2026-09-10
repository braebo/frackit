<!-- <script lang="ts">
	import HomeIcon from '$lib/components/header/Logo.svelte'
	import { device } from '$lib/utils/device.svelte'
	import DesktopNav from './navs/NavDesktop.svelte'
	import ThemeSwitch from '../ThemeSwitch.svelte'
	import { page } from '$app/state'
</script>

<span style="display: contents; --height: 4.25rem">
	<header class:scrolled={device.scrollY > 0}>
		<div class="home">
			<a href="/">
				<HomeIcon --width="1.5rem" active={page.url.pathname === '/'} />
			</a>
		</div>

		{#if !device.mobile}
			<DesktopNav />
		{/if}

		<div class="theme">
			<ThemeSwitch />
		</div>
	</header>
	<div class="header-buffer" style:height="var(--height)"></div>
</span>

<style lang="scss">
	header {
		box-sizing: border-box;
		position: fixed;
		width: 100%;

		display: flex;
		justify-content: space-between;
		align-items: center;

		height: var(--height);
		padding: 0 0.781rem;

		z-index: 50;

		&.scrolled {
			background-color: color-mix(in lch, transparent, var(--bg-a) 3%);
			backdrop-filter: blur(20px);
		}
	}

	.theme {
		position: relative;
		z-index: 30;
	}
</style> -->
