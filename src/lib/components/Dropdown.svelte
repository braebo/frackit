<script lang="ts">
	import type { Snippet } from 'svelte'

	import { hover } from '$lib/actions/hover'

	let {
		children,
		dropdown,
		depth = 0,
		force_open = false,
		onHover = () => {},
	}: {
		children: Snippet
		dropdown: Snippet
		depth?: number
		force_open?: boolean
		onHover?: (hovering: boolean) => void
	} = $props()

	let hovering = $state(false)
</script>

<div
	class="dropdown"
	class:open={force_open || hovering}
	use:hover={{ delay: 500 }}
	onhover={({ detail }) => {
		onHover(detail.hovering)
		hovering = detail.hovering
	}}
>
	{@render children()}

	<nav class="dropdown-content" class:depth-1={depth === 1}>
		{@render dropdown()}
	</nav>
</div>

<style lang="scss">
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
			top: var(--nav-height);
		}
	}

	.dropdown.open {
		.dropdown-content {
			pointer-events: all;
			clip-path: inset(0 0 0 0);
			transform: translate(-33%, 0);
		}
	}
</style>
