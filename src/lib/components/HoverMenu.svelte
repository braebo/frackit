<script lang="ts">
	import type { Snippet } from 'svelte'

	let { active, children }: { active?: boolean; children: Snippet } = $props()
</script>

<div class="hover-menu-outer" class:active>
	{@render children()}
</div>

<style lang="scss">
	.hover-menu-outer {
		display: flex;
		flex-wrap: nowrap;
		flex-direction: row;

		&.active {
			text-decoration: 1px underline var(--theme-a);
		}

		:global(a),
		:global(button) {
			display: block;

			width: 100%;
			padding: 1rem 1.5rem;

			color: inherit;

			text-decoration: none;
			line-height: 1;
			text-align: left;
		}
	}
</style>
