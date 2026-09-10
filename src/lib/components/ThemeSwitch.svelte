<script lang="ts">
	import { themer } from '$lib/themer/themer.svelte'

	let state = $derived(themer.preference)

	const toggle = () => {
		switch (state) {
			case 'light':
				themer.preference = 'dark'
				break
			case 'dark':
				themer.preference = 'system'
				break
			case 'system':
				themer.preference = 'light'
				break
		}
	}
</script>

<button class="switch {state}" title="toggle theme" onclick={toggle}>
	<div class="track round">
		<span class="thumb-content on" aria-hidden="true"></span>
		<span class="thumb-content off" aria-hidden="true"></span>
		<div class="track-content {state}" aria-hidden="true">{state}</div>
	</div>
</button>

<style lang="scss">
	.switch {
		all: unset;
		position: relative;
		--duration: 0.25s;

		--width: 4rem;
		--padding: 0.2rem;
		--accent: #2196f3;

		--thumb-size: 1.1rem;

		--thumb: var(--bg-a);

		--outline: var(--bg-b);
		--outline-focus: var(--bg-d);

		--height: calc(var(--thumb-size) * 1 + var(--padding) * 2);
		--transition: all var(--duration) cubic-bezier(0.05, 1, 0.56, 0.91);
		--transform: calc(var(--width) - var(--thumb-size) - var(--padding) * 2);
	}

	:global(:root.dark .switch) {
		--outline-focus: var(--bg-c);
		.track {
			box-shadow:
				-1px 1.5px 0.3rem rgba(0, 0, 0, 0.25) inset,
				0px 0.5px 0.1rem rgba(0, 0, 0, 0.25) inset;
		}
	}

	/* Container */

	.switch {
		contain: strict;
		
		position: relative;
		display: inline-block;

		width: var(--width);
		height: var(--height);
		max-width: 100%;
		max-height: 100%;

		border-radius: var(--radius);
		overflow: hidden;

		cursor: pointer;

		&:focus-visible {
			.track {
				outline: 2px solid var(--outline-focus);
			}
		}
	}

	/* Track */

	.track {
		position: absolute;
		inset: 0;

		background-color: var(--bg-a);
		outline-color: var(--outline, var(--bg-b));

		max-width: 100%;
		max-height: 100%;

		outline-width: 1.5px;
		outline-style: solid;
		border-radius: var(--radius);
		box-shadow:
			-1px 1px 0.33rem rgba(0, 0, 0, 0.33) inset,
			0px 1px 0.1rem rgba(0, 0, 0, 0.33) inset;

		cursor: pointer;
		transition:
			var(--transition),
			outline 0.15s;

		overflow: hidden;
	}

	/* Track Thumb */

	$thumb: '.track:before';
	#{$thumb} {
		background-color: var(--bg-c);

		content: '';
		position: absolute;
		left: var(--padding);
		bottom: var(--padding);

		width: var(--thumb-size);
		height: calc(var(--thumb-size) * 1);
		max-width: 100%;
		max-height: 100%;

		box-shadow:
			0.012rem 0.039rem 0 color-mix(in lch, var(--bg-d), transparent 50%),
			-0.012rem 0.012rem 0.004rem color-mix(in lch, var(--fg-d), transparent 75%) inset,
			-0.039rem 0.039rem 0.039rem color-mix(in lch, var(--fg-d), transparent 90%) inset,
			0rem -0.039rem 0.004rem rgba(1, 1, 1, 0.1) inset;

		border-radius: 0.25rem;

		transition: var(--transition);
	}

	/* Track Content */

	.track-content {
		position: absolute;
		top: 0;
		bottom: 0;

		display: flex;
		align-items: center;

		height: 100%;
		max-width: 100%;
		max-height: 100%;

		opacity: 0;

		user-select: none;
		pointer-events: none;
		transition: var(--transition);

		font-size: var(--font-sm);
		// font-size: 0.85rem;
		font-family: var(--font-a);
		font-variation-settings:
			'wght' 400,
			'wdth' 104;
		letter-spacing: 0.1rem;

		&.light {
			animation: in-left var(--duration) cubic-bezier(0.05, 1, 0.56, 0.91) forwards;
			left: 0.3125rem;
		}

		&.dark {
			animation: in-right var(--duration) cubic-bezier(0.05, 1, 0.56, 0.91) forwards;
			right: 0.3125rem;
		}

		&.system {
			animation: in-center var(--duration) cubic-bezier(0.05, 1, 0.56, 0.91) forwards;
			top: 0;
			left: 0;
			right: 0;
			margin: auto;
			width: fit-content;
		}
	}

	.track {
		color: var(--fg-d);

		&:has(.system) {
			color: var(--fg-c);
		}

		&:hover {
			color: var(--fg-b);
		}
	}

	/* Thumb */

	button.light #{$thumb} {
		transform: translateX(var(--transform));
	}

	button.system #{$thumb} {
		transform: translate(0, 0);
		width: calc(var(--width) - var(--padding) * 2);
		border-radius: 0.195rem;
	}

	/* Animations */

	@keyframes in-left {
		from {
			transform: translateX(calc(var(--transform) * -1));
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}

	@keyframes in-right {
		from {
			transform: translateX(var(--transform));
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}

	@keyframes in-center {
		from {
			transform: translateX(-0.25rem) scale(1);
			opacity: 0;
		}
		to {
			transform: scale(0.9);
			opacity: 1;
		}
	}
</style>
