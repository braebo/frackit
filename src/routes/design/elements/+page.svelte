<script lang="ts">
	import Page from '$lib/components/Page.svelte'
	import { IN } from '$lib/utils/transitions'
	import { fly } from 'svelte/transition'
	import { router } from '$lib/router'
</script>

<Page title="Elements">
	<p>The most common HTML elements with basic styles.</p>

	<p>
		<sub
			>ℹ
			<a href={router.gh('src/styles/elements.scss')} target="_blank" data-sveltekit-reload> elements.scss </a>
		</sub>
	</p>

	<div class="br-lg"></div>

	<section in:fly|global={{ ...IN, y: 7.5, duration: 300, delay: 150 }}>
		<h1>&lt;h1&gt;</h1>
		<h2>&lt;h2&gt;</h2>
		<h3>&lt;h3&gt;</h3>
		<h4>&lt;h4&gt;</h4>
		<h5>&lt;h5&gt;</h5>
		<h6>&lt;h6&gt;</h6>

		<strong>&lt;strong&gt;</strong>

		<em>&lt;em&gt;</em>

		<s>&lt;s&gt;</s>

		<small>&lt;small&gt;</small>

		<mark>&lt;mark&gt;</mark>

		<span>
			super
			<sup>&lt;script&gt;</sup>
		</span>

		<span>
			sub
			<sub>&lt;script&gt;</sub>
		</span>

		<ul>
			<li>
				&lt;li&gt;
				<ul>
					<li>
						&lt;li&gt;
						<ul>
							<li>&lt;li&gt;</li>
						</ul>
					</li>
					<li>
						&lt;li&gt;
						<ol>
							<li>&lt;li&gt;</li>
							<li>&lt;li&gt;</li>
						</ol>
					</li>
				</ul>
			</li>
		</ul>

		<button>Button</button>

		<p><code>&lt;code /&gt;</code></p>

		<div><!-- shiki-ts const tag = "highlighted code" shiki-ts --></div>

		<div>
			<!-- shiki-start
```ts
function syntaxHighlighting(): true {
	return true
}

console.log('some really long string that, were it not contained within this conveniently scrollable pre, would otherwise force a lesser pre to expand beyond the document bounds until it eventually causes horizontal overflow at the :root level, cursing innocent mobile users stumbling in from the corners of the internet as they attempt to scroll — explicitly solely — vertically');
```
		shiki-end -->
		</div>

		<!-- svelte-ignore a11y_invalid_attribute -->
		<!-- prettier-ignore -->
		<p>
			Paragraph canary danced beneath <a href="">azure skies</a>, while marble fountains sparkled with untold mysteries. Velvet shadows crept along ancient walls, whispering secrets to passing travelers who dared not linger.
		</p>

		<!-- svelte-ignore a11y_invalid_attribute -->
		<!-- prettier-ignore -->
		<blockquote> Blockquote golden leaves tumbled through forgotten courtyards, each one carrying <a href="">fragments of memories</a> long since scattered to the winds.</blockquote>

		<!-- svelte-ignore a11y_invalid_attribute -->
		<a href="">
			https://some.really-long-link-that-would-normally-cause-horizontal-overflow-but-it-wraps-instead
		</a>
	</section>

	<!-- <Inputs /> -->

	<!-- <div class="br-xl" /> -->
	<div class="br-xl" />
</Page>

<style>
	section {
		gap: 1.5rem;
	}
</style>
