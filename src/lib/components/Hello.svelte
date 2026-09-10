<script lang="ts">
	import { fade_in, fade_out } from '$lib/utils/transitions'
</script>

<section in:fade_in out:fade_out>
	<h1>
		{#each 'Hello' as letter}
			<div class="letter">{letter}</div>
		{/each}
	</h1>
</section>

<style lang="scss">
	section {
		position: relative;
		perspective: 800px;
		perspective-origin: 50% 50%;

		width: fit-content;
		margin-top: 3.125rem;
	}

	h1 {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;

		font-size: var(--font-xl);
		font-family: var(--font-a);
		font-variation-settings:
			'wght' 900,
			'wdth' 125;

		min-width: 4.375rem;
	}

	.letter {
		position: relative;

		opacity: 0;
		transform: translateX(3.125rem);
		text-align: center;

		animation: letterIn cubic-bezier(0.25, 1, 0.5, 1) forwards;
		animation-delay: 0.5s;
	}

	@function offset($i) {
		@if $i == 1 {
			@return 0s;
		} @else {
			@return offset($i - 1) + 0.15s;
		}
		@return $i * 0.15s;
	}

	@for $j from 1 through 5 {
		.letter:nth-child(#{$j}) {
			animation-delay: offset($j);
			animation-duration: 1.5s - offset($j);
		}
	}

	@keyframes letterIn {
		0% {
			opacity: 0;
			transform: translateX(0.5rem);
			font-variation-settings:
				'wght' 100,
				'wdth' 125;
		}
		100% {
			opacity: 1;
			transform: translateX(0);
			font-variation-settings:
				'wght' 500,
				'wdth' 100;
		}
	}
</style>
