<!-- @component
    Links section of the navigation bar containing the main navigation links.
-->

<script lang="ts">
	import { router, type Route } from '$lib/router'

	import Dropdown from '$lib/components/Dropdown.svelte'
	import Self from './Nav.Links.svelte'
	import { page } from '$app/state'
	import { hover } from '$lib/actions/hover'
	import Inspect from '../Inspect.svelte'

	let { links, depth = 0 }: { links: readonly Route[]; depth?: number } = $props()

	let hoverId = $state<string | null>(null)
	let root = $derived(depth === 0)

	function setActiveHoverId(hovering: boolean, path: string) {
		console.log('setActiveHoverId', hovering, path)
		if (hovering) {
			hoverId = path
		} else if (hoverId === path) {
			hoverId = null
		}
	}

	const routeMeta = (
		path: Route['path'],
		page: typeof import('$app/state').page,
	): { active: boolean; parent: boolean; child: boolean; sibling: boolean } => {
		return {
			active: router.isActive(path, page),
			parent: router.isParent(path, page),
			child: router.isChild(path, page),
			sibling: router.isSibling(path, page),
		}
	}
</script>

{#key hoverId}
	{#if depth === 0}
		<div
			class="inspect"
			style="
	position: absolute;
	top: 5rem;
	right: 1rem;
"
		>
			<Inspect values={{ hoverId }} />
		</div>
	{/if}
{/key}

<div class="links" class:root>
	{#each links as link, i}
		{@const force_open = !(hoverId && hoverId !== link.path) && router.isParent(link.path, page)}
		{@const only_child = link.children?.length === 1}

		{#if link.children?.[0]?.path}
			<div class="dropdown" class:open={force_open || (hoverId && link.path.startsWith(hoverId))}>
				<div
					class="link-wrapper"
					style:--delay="{i * 0.1}s"
					use:hover={{ delay: 500 }}
					onhover={({ detail }) => {
						if (detail.hovering === false && hoverId !== link.path) {
							return
						}
						setActiveHoverId(detail.hovering, link.path)
					}}
				>
					{@render anchor(link, depth)}
				</div>

				<nav
					class="dropdown-content"
					class:depth-1={depth + 1 === 1}
					class:only-child={only_child}
					data-depth={depth}
				>
					<div class="submenu" class:active={router.isActive(link.path, page)}>
						{#if link.children?.length}
							<Self links={link.children} depth={depth + 1} />
						{/if}
					</div>
				</nav>
			</div>
		{:else}
			<div
				class="link-wrapper"
				style:--delay="{i * 0.1}s"
				use:hover={{ delay: 500 }}
				onhover={({ detail }) => {
					if (detail.hovering === false && hoverId !== link.path) {
						return
					}
					setActiveHoverId(detail.hovering, link.path)
				}}
			>
				{@render anchor(link, depth)}
			</div>
		{/if}
	{/each}
</div>

{#snippet anchor(link: Route, depth: number)}
	{@const { active, parent, child, sibling } = routeMeta(link.path, page)}

	<a
		class="depth-{depth}"
		class:root
		href={link.path}
		data-text={link.title}
		aria-current={active ? 'page' : null}
		class:sibling
		class:active
		class:parent
		class:child
	>
		{link.title}
	</a>

	{#if depth === 0 && link.children?.length}
		<div class="lip" class:active class:parent class:sibling></div>
	{/if}
{/snippet}

<style lang="scss">
	.links {
		display: flex;
		width: 100%;
		align-items: center;

		&:not(.root) {
			gap: 0.5rem;
		}
	}

	.dropdown {
		position: relative;
		display: inline-block;
		height: 100%;

		z-index: 100;
	}

	.dropdown-content {
		position: absolute;

		transition: 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
		clip-path: inset(0 0 100% 0);
		transform: translate(-33%, 0);

		transform-origin: center;

		pointer-events: none;
		isolation: isolate;
		z-index: -1;

		top: calc(var(--nav-height) * 0.75);
		&.depth-1 {
			top: calc(var(--nav-height) + 0.5rem);
		}
	}

	.dropdown.open {
		.dropdown-content {
			pointer-events: all;
			clip-path: inset(0 0 0 0);
			transform: translate(-33%, 0);

			&.only-child {
				transform: translate(0, 0);
			}
		}
	}

	a.root {
		height: 100%;
		transform: translateX(-1rem);
		clip-path: inset(0 100% 0 0);
		animation: reveal-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) var(--delay, 0.2s) forwards;
	}

	@keyframes reveal-in {
		to {
			clip-path: inset(0 0 0 0);
			transform: translateX(0);
		}
	}

	.link-wrapper {
		display: flex;
		align-items: center;
		gap: 0.5rem;

		height: 100%;
	}

	.lip {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;

		width: 1rem;
		height: 0.2rem;
		margin: 0 auto;

		border-radius: var(--radius-sm);
		transition: 0.2s;

		&.active {
			background: var(--theme-a);
			width: 1.5rem;
		}

		&.parent {
			background: color-mix(in srgb, var(--theme-a), var(--bg-a) 33%);
		}
	}

	a:hover + .lip,
	a.active + .lip {
		opacity: 1;
		background-color: var(--theme-a);
	}

	a:hover:not(.active) + .lip {
		opacity: 1;
		background-color: color-mix(in srgb, var(--theme-a), var(--bg-c) 50%);
	}

	a {
		box-sizing: content-box;

		position: relative;
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		padding: 0 1.5rem;

		color: inherit;
		outline: none;
		border: none;
		// outline-offset: -2px;
		text-decoration: none;

		font-size: var(--font-sm);
		font-family: var(--font-a);
		font-variation-settings: 'wght' 450;
		letter-spacing: 0.05rem;
		white-space: nowrap;
		line-height: 1.5;

		transition: 0.1s;

		&.active {
			color: var(--theme-a);
		}

		&:hover:not(.active):not(.root) {
			font-variation-settings: 'wght' 550 !important;
		}

		&.child:not(.active):not(:hover):not(:focus-visible) {
			color: var(--fg-c);
			font-variation-settings: 'wght' 450 !important;
		}

		&::after {
			content: attr(data-text);
			content: attr(data-text) / '';
			height: 0;
			visibility: hidden;
			overflow: hidden;
			user-select: none;
			pointer-events: none;

			@media speech {
				display: none;
			}
		}

		&.active,
		&::after {
			font-variation-settings: 'wght' 620;
		}
	}

	a:not(.root) {
		padding: 1rem 1rem;

		background: rgba(from var(--bg-a) r g b / 0.8);
		border-radius: var(--radius-sm);
		backdrop-filter: blur(6px);

		font-size: var(--font-sm);
		line-height: 1;
	}

	.submenu {
		display: flex;
		flex-wrap: nowrap;
		flex-direction: row;
	}
</style>
