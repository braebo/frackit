<script lang="ts">
	import { dev } from '$app/environment'
	import { page } from '$app/state'

	if (dev) console.log(page.error)
</script>

<h1>{page.status}</h1>

<section>
	{#if page.error?.message}
		<pre class="message">{page.error.message}</pre>
	{/if}

	{#if dev && page.error && 'stack' in page.error}
		<pre class="stack">{page.error.stack}</pre>
	{/if}

	<div class="br-md"></div>
	<!-- <button onclick={() => window.history.back()}>Go back</button> -->
	<a href="/" class="btn">Go home</a>
</section>

<style lang="scss">
	h1 {
		margin: 15vh auto 0 auto;
		width: max-content;

		color: var(--warn);

		font-size: 6.25rem;
		font-weight: 100;
	}

	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
	}
</style>
