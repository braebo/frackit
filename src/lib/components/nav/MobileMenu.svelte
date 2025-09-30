<script lang="ts">
	import { fly, type TransitionConfig } from 'svelte/transition'
	import { router, type Route } from '$lib/router'

	import { expoOut, quintOut } from 'svelte/easing'
	import { Logger } from '$lib/utils/logger/logger'
	import { afterNavigate } from '$app/navigation'
	import { trap } from '$lib/actions/trap'
	import { Tween } from 'svelte/motion'
	import { gr, r } from '@braebo/ansi'
	import { page } from '$app/state'
	import { tick } from 'svelte'

	const log = new Logger('MobileMenu', { fg: 'crimson' })

	interface Props {
		links: Route[]
		current: Route | undefined
		onclose: () => void
	}

	let { links, current, onclose }: Props = $props()

	let show_context_menu = $state(!!current?.children)

	let universal_menu_inner_height = $state(0)
	let menu_height = $state(0)
	let ready = $state(false)
	let depth = $derived(current?.path.split('/').filter(Boolean).length ?? 0)
	$inspect('depth', depth)

	let universal_menu: HTMLElement | undefined = $state()

	afterNavigate(onclose)

	$effect(() => {
		// Ensures the menu-background height is applied without an animation.
		setTimeout(() => {
			ready = true
			if (current) show_context_menu = !!current?.children
			scroll(undefined, 0)
		})
	})

	function popup(node: HTMLElement, { duration = 400, easing = expoOut } = {}): TransitionConfig {
		const height = current ? node.clientHeight : universal_menu_inner_height

		return {
			css: (t, u) => `transform: translate3d(0, ${(height * u) / 0.9}px, 1px) scale(${0.9 + 0.1 * t})`,
			easing,
			duration,
		}
	}

	let parts = $derived.by(() => {
		const parts = current?.path.split('/').filter(Boolean)

		let path = ''
		let routes = [] as Route[]

		for (const part of parts ?? []) {
			path += '/' + part
			const route = router.get(path)
			if (route) {
				routes.push(route)
			}
		}

		return routes
	})

	let scroll_left = new Tween(0, { duration: 500, easing: quintOut })
	let viewport: HTMLElement | undefined = $state()
	function scroll(_: any, i: number) {
		if (!viewport) return

		if (parts.length > 1) {
			const target = viewport.querySelector(`[data-index="${i}"]`) as HTMLElement
			scroll_left.set(viewport.offsetLeft, { duration: 0 })
			scroll_left.set(target.offsetLeft)
		}
	}

	$effect(() => {
		scroll_left.current
		if (!viewport) return
		viewport.scrollLeft = scroll_left.current
	})

	async function clickLink(event: MouseEvent, link: Route, expanded: boolean) {
		log.group('clickLink', undefined, { path: link.path, expanded, __inline__: true })

		event.preventDefault()

		if (expanded) {
			scroll_left.set(viewport!.scrollLeft, { duration: 0 })
			if (parts.length > 1) {
				const parent = parts.at(-2)
				log.info('UPDATE ' + r('current') + ' to ' + r(parent?.path))
				current = parent
				scroll_left.set(0)
			} else {
				log.info('UPDATE ' + r('current') + ' to ' + gr('undefined'))
				current = undefined
				show_context_menu = false
				scroll_left.set(0)
			}

			log.groupEnd()
			return
		} else {
			log.info('UPDATE ' + r('current') + ' to ' + r(link.path))
		}

		current = link

		await tick()

		show_context_menu = true

		await tick()

		// nav_context_instance?.scrollToActive()
		log.groupEnd()
	}
</script>

{#snippet link(link: Route, active: boolean)}
	{@const parent = current?.path.startsWith(link.path)}
	{@const noteworthy = active && (link.path === page.url.pathname || (parent && link.path !== '/'))}
	{@const expanded = current?.path.includes(link.path)}
	<li class:active={noteworthy}>
		<a href={link.path} class:active={noteworthy}>
			{link.title}
		</a>

		{#if link.children?.length}
			<button
				class="raised icon"
				onclick={e => clickLink(e, link, !!expanded)}
				aria-label="Show {link.title} submenu"
			>
				<svg viewBox="0 0 24 24" width="100%" height="100%" overflow="visible">
					<path
						fill="none"
						stroke="currentColor"
						stroke-width="1"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="morph-path"
						d={expanded
							? 'M 9.4 10.6 l 4.6 0 q 0.15 0.15 0.213 0.325 t 0.062 0.375 q 0 0.2 -0.063 0.375 T 14 12 L 9.4 11.8'
							: 'M 9.4 6 l 4.6 4.6 q 0.15 0.15 0.213 0.325 t 0.062 0.375 q 0 0.2 -0.063 0.375 T 14 12 L 9.4 16.4'}
					/>
				</svg>
			</button>
		{/if}
	</li>
{/snippet}

<div class="menu" use:trap={{ reset_focus: false }}>
	<div class="mobile-main-menu" transition:popup={{ duration: 200, easing: quintOut }}>
		<div class="menu-background" class:ready style:height="{menu_height}px">
			<div class="shadow"></div>
		</div>
		<div
			class="clip"
			style:--height-difference="{menu_height - universal_menu_inner_height}px"
			ontransitionstart={e => {
				const target = e.target as HTMLElement

				if (!target?.classList.contains('viewport')) return
				if (e.propertyName !== 'transform') return

				// We need to apply a clip-path during the transition so that the contents
				// are constrained to the menu background, but only while the transition
				// is running, otherwise it prevents the contents from being scrolled.
				const a = 'calc(var(--height-difference) + 1px)'
				const b = '1px'

				const start = show_context_menu ? a : b
				const end = show_context_menu ? b : a

				const container = e.currentTarget

				container.style.clipPath = `polygon(0% ${start}, 100% ${start}, 100% 100%, 0% 100%)`

				setTimeout(() => {
					container.style.clipPath = `polygon(0% ${end}, 100% ${end}, 100% 100%, 0% 100%)`
				}, 0)
			}}
			ontransitionend={e => {
				const target = e.target as HTMLElement

				if (!target?.classList.contains('viewport')) return
				if (e.propertyName !== 'transform') return

				e.currentTarget.style.clipPath = ''

				// Whenever we transition from one menu to the other, we need to move focus to the first item in the new menu.
				if (!show_context_menu) {
					universal_menu?.querySelector('a')?.focus()
				}
			}}
		>
			<div
				class="viewport"
				class:offset={show_context_menu && current?.children?.length}
				bind:clientHeight={menu_height}
				bind:this={viewport}
			>
				<div class="universal" bind:this={universal_menu}>
					<div class="contents" bind:clientHeight={universal_menu_inner_height} class:current={true}>
						<ul>
							{#each links as l}
								{@render link(l, !!current?.path.includes(l.path))}
							{/each}
						</ul>

						<ul class="socials">
							<li>
								<a href="https://github.com/braebo/svelte-starter">
									<div data-icon="github" aria-label="GitHub Repo"></div>
									<div class="text">GitHub</div>
								</a>
							</li>
							<li>
								<a href="https://bsky.app/profile/braebo.dev">
									<div data-icon="bluesky" aria-label="braebo on Bluesky"></div>
									<div class="text">Bluesky</div>
								</a>
							</li>
						</ul>
					</div>
				</div>

				{#each parts as part, i (part.path)}
					<div
						class="context"
						style="left: {50 + 100 * i}%;"
						data-index={i}
						data-path={part.path}
						use:scroll={i}
						inert={!show_context_menu}
						style:height="{universal_menu_inner_height}px"
					>
						<ul class="children">
							{#each part.children ?? [] as child}
								{@render link(
									child,
									current?.path.includes(child.path) || part.path.includes(child.path),
								)}
							{/each}
						</ul>
					</div>

					{#if ready && depth > 1}
						<button
							class="back"
							aria-label="Back"
							onclick={e => clickLink(e, current!, true)}
							in:fly|global={{ x: -5, duration: 500, delay: 100, easing: quintOut }}
							out:fly={{ x: 5, duration: 300, easing: quintOut }}
						>
							<svg viewBox="0 0 24 24" width="100%" height="100%" overflow="visible">
								<path
									fill="none"
									stroke="currentColor"
									stroke-width="1"
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M 9.4 6 l 4.6 4.6 q 0.15 0.15 0.213 0.325 t 0.062 0.375 q 0 0.2 -0.063 0.375 T 14 12 L 9.4 16.4"
								/>
							</svg>
						</button>
					{/if}
				{/each}

				{#if parts.length === 1}
					<div class="pad"></div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.menu {
		view-transition-name: mobile-menu;
		position: fixed;
		left: 0px;
		bottom: var(--bottom, var(--nav-height));

		width: 100%;

		border-radius: 1rem 1rem 0 0;

		transform: translate3d(0, 0, 0);

		overflow-y: hidden;
		overflow-x: hidden;
		pointer-events: none;
		z-index: 100;
	}

	.menu {
		--menu-bg: color-mix(in oklab, var(--bg-a), var(--bg-b) 25%);

		--link-bg: color-mix(in oklab, var(--bg-b), var(--bg-c) 25%);
		--link-bg-active: var(--bg-c);
		--link-bg-hover: color-mix(in oklab, var(--bg-b), var(--bg-c) 90%);
		--link-outline: color-mix(in oklab, var(--bg-b), var(--bg-d) 20%);
		--link-outline-active: var(--link-outline);
		--link-color: var(--fg-d);
		--link-color-active: var(--fg-a);
		--link-color-hover: var(--fg-a);

		--btn-bg: color-mix(in oklab, var(--bg-a), var(--bg-b) 25%);
		--btn-bg-active: var(--bg-a);
		--btn-outline: 1px solid var(--bg-c);
		--btn-outline-active: 1px solid var(--bg-c);

		--btn-bg-hover: var(--bg-c);
		--btn-bg-hover-active: color-mix(in oklab, var(--bg-c), var(--bg-b) 10%);

		--svg-color-active: color-mix(in oklab, var(--bg-c), var(--theme-a) 66%);

		button {
			box-shadow: var(--shadow-sm);
		}

		:root.light & {
			--menu-bg: color-mix(in oklab, var(--bg-a), var(--bg-b) 25%);

			--link-bg: var(--bg-b);
			--link-bg-active: var(--bg-a);
			--link-bg-hover: var(--bg-a);
			--link-outline: none;
			--link-outline-active: 1px solid var(--bg-b);

			--btn-bg: var(--link-bg);
			--btn-outline: none;
			--btn-outline-active: none;
			--btn-bg-active: color-mix(in oklab, var(--bg-a), var(--bg-b) 25%);
			--btn-bg-hover: var(--bg-a);
			--btn-bg-hover-active: var(--bg-b);

			a {
				font-variation-settings: 'wght' 442;
				box-shadow: 0 1px 8px rgba(255, 255, 255, calc(var(--shadow-lightness) * 0.3)) inset;
			}

			button {
				box-shadow: 0 0 0 rgba(0, 0, 0, calc(var(--shadow-lightness) * 0.4));
			}
			li.active button {
				box-shadow: -1px 2px 4px rgba(0, 0, 0, calc(var(--shadow-lightness) * 0.4));
			}

			li:hover {
				--link-bg: var(--bg-b);
				--link-bg-hover: var(--bg-a);
			}
		}
	}

	.menu-background {
		position: absolute;
		left: 0;
		bottom: 0;

		width: 100%;
		height: 99.5%;

		border-radius: 1rem 1rem 0 0;
		// background: var(--bg-b);
		background: var(--menu-bg);

		transition: 0.3s var(--quint-out);
		transition-property: none;

		will-change: height;

		&.ready {
			transition-property: height;
		}

		:root.dark & {
			border-top: solid 1px var(--bg-c);
		}
	}

	.shadow {
		position: absolute;
		left: 0;
		bottom: 0;

		width: 100%;
		height: 1rem;

		background-image: linear-gradient(
			to bottom,
			rgba(0, 0, 0, 0),
			rgba(0, 0, 0, calc(var(--shadow-lightness) * 0.15))
		);
	}

	.mobile-main-menu {
		contain: layout paint;

		height: 100%;

		transform: translateZ(0);
		backface-visibility: hidden;
	}

	.clip {
		width: 100%;
		height: 100%;

		transition: clip-path 0.3s cubic-bezier(0.23, 1, 0.32, 1);
		will-change: clip-path;
	}

	.viewport {
		position: relative;
		display: flex;
		bottom: -1px;

		width: 200%;
		height: 100%;

		transition: 0.3s cubic-bezier(0.23, 1, 0.32, 1);

		overflow-x: scroll;
		scroll-snap-type: x mandatory;
		pointer-events: none;

		&.offset {
			width: 100%;
		}
	}

	.morph-path {
		transition: d 0.3s cubic-bezier(0.23, 1, 0.32, 1);
	}

	.pad {
		min-width: 50%;
	}

	button,
	a {
		pointer-events: auto;
		outline-offset: -1px;
	}

	button {
		display: flex;
		align-items: center;
		justify-content: center;
		transform: translateX(-1px);
		gap: 1.5rem;

		width: calc(4rem + 1px);
		padding: 0;

		background: var(--btn-bg);
		outline: var(--btn-outline);
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;

		&:hover {
			background-color: var(--btn-bg-hover);
			outline: var(--btn-outline);
		}
	}

	button.back {
		position: absolute;
		left: calc(50% + var(--padding));
		bottom: var(--padding);
		gap: 0;

		height: 4rem;
		width: 4rem;

		background: var(--btn-bg-active);
		border-radius: var(--radius);

		svg {
			transform: scale(-0.75, 0.75) translate(0.25rem, 0);
		}
	}

	li .icon svg {
		transform-origin: center;
		transform: scale(0.75) translate(0, 0);
		transition: 1s cubic-bezier(0.23, 1, 0.32, 1);
	}

	li.active {
		button {
			background: var(--btn-bg-active);
			outline: var(--btn-outline-active);
		}

		.icon {
			svg {
				color: var(--svg-color-active);
				transform: scale(1, 0.5) translate(0, 0);
				transition: 0.3s cubic-bezier(0.23, 1, 0.32, 1);

				path {
					stroke-width: 2.3;
				}
			}
		}
	}

	li a {
		padding: 1rem 1.25rem;

		color: var(--link-color);
		background: var(--link-bg);
		outline: 1px solid var(--link-outline);
		border-radius: var(--radius);
		box-shadow: none;

		&.active {
			color: var(--link-color-active);
		}

		&:hover {
			color: var(--link-color-hover);
		}
	}

	li:has(button) a {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}

	li.active a {
		background: var(--link-bg-active);
		outline: var(--link-outline-active);
	}

	li.active:has(button) a {
		max-width: calc(100% - 2rem);
	}

	.context {
		li a {
			color: var(--link-color-active);
		}
	}

	@media (hover: hover) {
		li a:hover {
			background: var(--link-bg-hover);
		}

		li.active button:hover {
			background: var(--btn-bg-hover-active);
		}
	}

	.universal {
		min-width: 50%;
	}

	.contents,
	.context {
		container-name: col;
		container-type: inline-size;

		min-width: 50%;
		height: fit-content;
		max-height: 70vh;
		padding: 1rem;

		overflow-y: scroll;

		&::-webkit-scrollbar {
			width: 0.5rem;
		}

		&::-webkit-scrollbar-thumb {
			background: var(--bg-b);
			border-radius: 1rem;
			&:hover {
				background: var(--bg-c);
			}
		}

		&::-webkit-scrollbar-track {
			background: var(--bg-a);
			background: transparent;
		}
	}

	.context {
		right: 0;
		border-radius: 1rem 1rem 0 0;
	}

	.universal .contents,
	.context,
	.menu-background {
		pointer-events: all;
	}

	.universal,
	.context {
		ul {
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}

		li {
			display: flex;
			margin-left: 0;

			a {
				flex: 1;
			}
		}
	}

	.viewport {
		&::-webkit-scrollbar {
			height: 0px;
			display: none;
		}
	}

	ul.socials {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		justify-content: center;
		justify-content: space-around;
		justify-content: space-between;
		align-items: flex-end;
		width: 100%;
		max-width: 100%;
		flex-shrink: 1;
		overflow: hidden;
		height: 5rem;
		padding: 0;
		margin: 0;

		li {
			padding: 0;
			margin: 0;
		}

		li a {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			gap: 0.5rem;

			max-width: fit-content;
			height: 4rem;
			padding: 1rem 1rem 1rem 0.5rem;
			margin: 0;
			background: none;

			&:hover {
				background: var(--link-bg-hover);

				[data-icon] {
					background-color: var(--theme-a);
				}
			}

			:root.light & {
				outline: var(--link-outline-active);
			}
		}

		[data-icon] {
			width: 3rem;
			height: 100%;

			background-color: var(--fg-e);

			mask-repeat: no-repeat;
			mask-position: 50% 50%;
			mask-size: calc(100% - 1rem) auto;

			transition: background-color 0.15s;

			&:hover {
				background-color: var(--theme-a);
			}
		}

		[data-icon='bluesky'] {
			mask-image: url('$lib/icons/bluesky.svg');
		}

		[data-icon='github'] {
			width: 3rem;
			mask-image: url('$lib/icons/github.svg');
		}
	}

	// @container col (max-width: 300px) {
	@container col (max-width: 66cqi) {
		ul.socials li a {
			// background: none !important;
			padding: 1rem 0.5rem;
		}
		ul.socials li a .text {
			outline: 1px solid lime !important;
			display: none;
			visibility: hidden;
		}
	}
</style>
