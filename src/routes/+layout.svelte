<script lang="ts">
	import { setupViewTransition } from 'sveltekit-view-transition'
	import Shell from '$lib/components/Shell.svelte'
	import Nav from '$lib/components/nav/Nav.svelte'
	import Gooey from '$lib/components/Gooey.svelte'
	import { BROWSER, DEV } from 'esm-env'
	import { page } from '$app/state'
	import '../styles/app.scss'

	setupViewTransition()

	let { data, children: layout_children } = $props()
</script>

<svelte:head>
	<title>Svelte Starter · {data.title}</title>
</svelte:head>

<Shell>
	{#snippet top_nav()}
		<Nav title={data.title} links={data.routes} />
		<div class="br-lg" />
	{/snippet}

	{#snippet children()}
		<main id="main">
			{@render layout_children()}
		</main>
	{/snippet}
</Shell>

{#if DEV && BROWSER}
	<Gooey title={page.data.title} />
{/if}
