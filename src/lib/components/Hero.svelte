<script lang="ts">
	import { browser } from '$app/environment'
	import Logo from './header/Logo.svelte'
	import { Spring } from 'svelte/motion'

	let y = $state(100)

	const logo_y = new Spring(100, { stiffness: 0.015, damping: 0.075 })

	function transition(node: HTMLElement, { i }: { i: number }) {
		node.animate(
			{ transform: 'translateY(0)' },
			{
				duration: Math.max(1500, 1000 + i * 75),
				delay: Math.pow(i * 0.05, 0.5 / i) * 100,
				fill: 'forwards',
				easing: 'cubic-bezier(.99,-0.29,.07,1.34)',
			},
		).commitStyles()
	}

	if (browser) {
		setTimeout(() => {
			y = 0
			logo_y.set(0)
		}, 850)
	}
</script>

<div class="br-lg"></div>

<div class="hero">
	{@render word('svelte')}

	<div
		class="logo-wrapper"
		style:transform="translateY({logo_y.current.toFixed(2)}%) rotate3d(0, 1, 0, {(90 * logo_y.current) / 100}deg)"
	>
		<div class="logo">
			<Logo active={false} --width="4rem" />
		</div>
	</div>

	{@render word('starter', 6)}
</div>

{#snippet word(letters: string, start = 0)}
	<div class="word">
		{#each letters as letter, i}
			{@const pct = (100 / letters.length) * i}

			<span
				class="letter"
				use:transition={{ i: start + i }}
				style:color="color-mix(in srgb, var(--fg-a), var(--fg-c) {pct}%)"
			>
				{letter}
			</span>
		{/each}
	</div>
{/snippet}

<style lang="scss">
	.hero {
		display: flex;
		position: relative;
		align-items: center;
		gap: 2rem;

		width: fit-content;
		margin: 0 auto;
	}

	.word {
		position: relative;
		display: flex;
		flex-wrap: nowrap;

		min-width: fit-content;
		margin: 0 auto;

		font-size: var(--font-xxxl);
		font-family: var(--font-a);
		font-variation-settings: 'wght' 200;
		text-align: center;
		line-height: 1;

		overflow: hidden;
	}

	.letter {
		transform: translateY(4.438rem);
		user-select: none;
	}

	.logo-wrapper {
		position: relative;
		top: 0.5rem;
		width: 100%;
		height: 100%;
	}

	@keyframes rotate {
		to {
			opacity: 1;
			transform: rotate3d(0, 1, 0, 0deg);
		}
	}

	@media (max-width: 831px) {
		.br-lg {
			height: 20vh;
		}
	}
</style>
