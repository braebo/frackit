<script lang="ts">
	let { active } = $props()
</script>

<div class="logo" class:active>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 115 92"
		width="100%"
		height="100%"
		fill="none"
	>
		<circle cx="57.5" cy="46" r="80" stroke="var(--circle, var(--accent))" stroke-width="8" />

		<g class="s-right">
			<path
				fill="var(--accent)"
				d="m107 69.6 5.3 15.2-5.9 3a2 2 0 0 1-1.1.2H84c-.4 0-.7 0-1-.2l-1.1-.5L60.7 78c-.4-.2-.6-.5-.7-.8a3 3 0 0 1-.2-1V50c0-1 .3-1.7 1-2l17.7-9v-3l-17.7-7c-.7-.3-1-1-1-1.8V9.5c0-.4.1-.8.4-1 .2-.3 6.3-3.3 6.3-3.3L85.3 8c.7 0 1.2.1 1.6.3l1.2.5 17.8 10.7c.5.4.9.7 1 1V48c0 .9-.3 1.5-1 1.8l-14.1 6.6v4l14.3 7.3c.5.3.7.6.8.9v1.1Z"
				class="back"
			/>
			<path
				fill="currentColor"
				d="M111.3 85c1.1 0 1.7-.5 1.7-1.5v-18c-.2-.4-.4-.7-.9-1l-14.3-7.2v-3l14.1-6.6a2 2 0 0 0 1.1-1.8v-27a5 5 0 0 0-.1-1.4c-.1-.3-.4-.7-1-1L94.1 5.8l-1.2-.6-1.5-.2H67.5c-1.1 0-1.7.5-1.7 1.5v17.8c0 .8.4 1.4 1 1.8L84.5 33v3l-17.7 9c-.6.4-1 1-1 2v26.1c0 .3 0 .7.2 1 .1.4.3.6.7.8l21.2 9.4 1 .5 1.1.2h21.3Z"
				class="front"
			/>
		</g>

		<g class="s-left">
			<path
				fill="var(--accent)"
				d="M8.8 69.6 3.5 84.8l5.9 3c.3.2.6.2 1.1.2h21.3c.4 0 .7 0 1-.2l1-.5L55.2 78c.4-.2.6-.5.7-.8l.2-1V50c0-1-.3-1.7-1-2l-17.7-9v-3L55 29c.7-.3 1-1 1-1.8V9.5c0-.4-.1-.8-.4-1-.2-.3-6.3-3.3-6.3-3.3L30.4 8c-.6 0-1.1.1-1.5.3l-1.2.5L10 19.5c-.5.4-.9.7-1 1V48c0 .9.3 1.5 1 1.8l14 6.5v4L9.7 67.6c-.5.3-.7.6-.8.9v1.1Z"
				class="back"
			/>
			<path
				fill="currentColor"
				d="M4.5 85c-1.1 0-1.7-.5-1.7-1.5v-18c.2-.4.4-.7.9-1L18 57.4v-3L3.9 47.7a2 2 0 0 1-1.1-1.8v-27l.1-1.4c.1-.3.4-.7 1-1L21.7 5.8l1.2-.6 1.5-.2h23.9c1.1 0 1.7.5 1.7 1.5v17.8c0 .8-.4 1.4-1 1.8L31.3 33v3L49 45c.6.4 1 1 1 2v26.1c0 .3 0 .7-.2 1-.1.4-.3.6-.7.8l-21.2 9.4-1 .5-1.1.2H4.5Z"
				class="front"
			/>
		</g>
	</svg>
</div>

<style lang="scss">
	.logo {
		position: relative;
		display: flex;
		aspect-ratio: 1;

		width: var(--width);
		max-width: var(--max-width);
		height: fit-content;

		transition: 0.25s ease-out;
		color: var(--fg-d);
		--accent: var(--bg-c);

		&.active {
			color: var(--fg-a);
			--accent: var(--theme-a);

			path {
				stroke-width: 4;
			}
		}

		&:hover {
			--accent: var(--theme-a);
		}
	}

	svg {
		position: relative;
		overflow: visible;
	}

	path,
	circle {
		transition: 0.25s ease-out;
		transition-property: fill, stroke, stroke-width;
	}

	path {
		animation: grow 0.2s cubic-bezier(0.1, 0.75, 0.3, 1) var(--delay, 1.7s) forwards;
		transform: scale(0);
		transform-origin: center;
	}

	@keyframes grow {
		to {
			transform: scale(0.9);
		}
	}

	circle {
		opacity: 0;
		transform-origin: center;
		animation: spin 1.5s 1s forwards;
	}

	@keyframes spin {
		0% {
			opacity: 0;
			transform: rotate3d(0, 1, 0, 0deg) scale(1);
		}

		33% {
			opacity: 0.5;
			transform: rotate3d(0, 1, 0.5, 180deg) scale(1.3);
		}

		66% {
			opacity: 1;
			transform: rotate3d(0, 0, 1, 270deg) scale(1);
		}

		100% {
			opacity: 1;
			transform: rotate3d(0, 1, 0, 360deg);
			animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
		}
	}
</style>
