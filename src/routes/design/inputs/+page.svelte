<script>
	import Page from '$lib/components/Page.svelte'
	import { router } from '$lib/router'
</script>

<Page>
	<p>Stock HTML input elements with basic styles.</p>

	<p>
		<sub
			>ℹ
			<a href={router.gh('src/styles/inputs.scss')} target="_blank" data-sveltekit-reload>
				inputs.scss
			</a>
		</sub>
	</p>

	<div class="br-lg"></div>

	<section style:gap="1.5rem">
		<label id="form">
			<div>form</div>

			<form>
				<label>
					<div>text</div>
					<input type="text" placeholder="foo" />
				</label>

				<label>
					<div>textarea</div>
					<textarea placeholder="lorem ipsum dolor sit amet"></textarea>
				</label>

				<label>
					<div>number</div>
					<input type="number" placeholder="123" />
				</label>
				<label>
					<div>range</div>
					<input type="range" />
				</label>
			</form>
		</label>

		<form>
			<label>
				<div>select</div>
				<select>
					<option>foo</option>
					<option>bar</option>
				</select>
			</label>

			<div class="row" style:justify-content="space-around">
				<label style="text-align: center">
					<div>checkbox</div>
					<input type="checkbox" checked />
					<input type="checkbox" />
				</label>

				<label for="" style="text-align: center">
					<div>radio</div>
					<input type="radio" name="radio" />
					<input type="radio" name="radio" checked />
					<input type="radio" name="radio" />
				</label>
			</div>
		</form>
	</section>
</Page>

<style>
	section {
		--width: min(100%, 26.25rem);
	}

	#form {
		width: var(--width);
		margin: 0 auto;
		> div {
			margin-bottom: 0.5rem;
		}
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1.875rem;

		width: var(--width);
		margin: 0 auto;
		padding: 1.875rem;

		/* background: color-mix(in srgb, var(--bg-a), var(--bg-b) 42%); */
		background: light-dark(color-mix(in srgb, var(--bg-a), var(--bg-b) 15%), #0a0a0d);
		border: 1px solid color-mix(in srgb, var(--bg-c), var(--bg-a) 42%);
		border-radius: var(--radius);
		box-shadow: var(--shadow);
	}

	label {
		font-size: var(--font);
		color: var(--fg-d);

		&:has(input[type='checkbox']) {
			pointer-events: none;
			input {
				pointer-events: all;
			}
		}
	}
</style>
