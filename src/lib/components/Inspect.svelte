<script lang="ts">
	import type { InspectProps, InspectOptions } from 'svelte-inspect-value'

	import Inspect from 'svelte-inspect-value'

	let { ...props }: InspectProps = $props()

	let props_with_defaults = Object.assign(
		{},
		{
			// parseJson: true,
			showLength: false,
			showTypes: false,
            expandLevel: 4,
		} satisfies Partial<InspectOptions>,
		props,
	) as InspectProps
</script>

<Inspect {...props_with_defaults} />
