<script lang="ts">
	import Inspect from '$lib/components/Inspect.svelte'

	let { data } = $props()
</script>

<section>
	<Inspect values={{tokens: data.tokens}} />
</section>
