<script lang="ts">
	import Page from '$lib/components/Page.svelte'
	import { router } from '$lib/router'
</script>

<Page title="Design">
	<div class="br-sm"></div>

	<p>Svelte Starter uses a minimal css reset, and somewhat opinionated default styles for vanilla HTML elements.</p>

	<div class="br-lg"></div>

	<section>
		<a href={router.link('/design/elements')}><h3>Elements</h3></a>
		<p>Stock HTML elements with a minimal CSS reset and a subtle style.</p>

		<a href={router.link('/design/inputs')}><h3>Inputs</h3></a>
		<p>Styled inputs with a minimal CSS reset.</p>
	</section>

	<div class="br-lg"></div>

	<section>
		<h2>CSS</h2>

		<p>CSS is a bit of a mess, but Svelte Starter tries to make it a bit more manageable.</p>

		<div class="br-sm"></div>

		<a href={router.link('/design/tokens')}><h3>Tokens & Utilities</h3></a>

		<p>
			A typical workflow usually involves the composition of utility classes from the various design tokens
			available, like the theme colors, font definitions, and spacing scale.
		</p>
	</section>
</Page>

<style lang="scss">
	p {
		padding-left: 0.5rem;
	}

	section {
		gap: 1.25rem;
	}
</style>
