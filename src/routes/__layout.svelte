<script>
	import '$lib/app.css';
	import '$lib/smui-dark.css';
	import 'tailwindcss/tailwind.css';
	import Nav from '$lib/nav.svelte';
	import store from '$store';
	import Snackbar from '$lib/snackbar.svelte';
	store.dispatch('startConnectome');
	// setInterval(() => store.dispatch('snackbar', 'hello everyone'), 5000);
</script>

<Nav />
<div class="view py-4">
	<slot />
</div>
<Snackbar />
