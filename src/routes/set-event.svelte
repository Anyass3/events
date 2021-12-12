<script>
	import SetEvent from '$lib/event.svelte';
	import store from '$store';
	const connected = store.g('connected');
</script>

<SetEvent />
