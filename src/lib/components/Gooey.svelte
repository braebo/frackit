<!-- @component
	A gooey instance for debugging state.
	Press `1` to toggle visibility.

	TODO: This component is currently in flux while gooey is being updated.  Leave it for now.
-->

<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { page } from '$app/state'
	import { Gooey } from 'gooey'
	import { DEV } from 'esm-env'

	let { title } = $props()

	let gooey: import('gooey').Gooey

	onMount(async () => {
		if (!DEV) return

		// const { Gooey } = await import('gooey')
		gooey = new Gooey({
			title,
			theme: 'scout',
			margin: { x: 16, y: 64 },
			storage: true,
		})
		gooey.element.style.setProperty('z-index', '200')
		gooey.element.style.setProperty('position', 'fixed')

		// gooey.hide(true)
		const page_folder = gooey.addFolder('page')

		console.log({ gooey, page_folder })

		// TODO - bindMany's type is broken in gooey now??
		try {

			page_folder.bindMany($state.snapshot(page.data), { exclude: ['title'] })
			page_folder.bindMany($state.snapshot(page.data), { exclude: ['title'], theme: 'light' })
		} catch (e) {
			console.error('WIP')
			console.error(e)
		}
	})

	onDestroy(() => gooey?.dispose())
</script>

<svelte:window
	onkeydown={e => {
		if (e.key === '1') {
			gooey?.toggleHidden()
		}
	}}
/>
