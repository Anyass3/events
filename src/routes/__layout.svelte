<script>
	import '$lib/app.css';
	import '$lib/smui-dark.css';
	import '@material/snackbar/dist/mdc.snackbar.css';
	import 'tailwindcss/tailwind.css';
	import Nav from '$lib/nav.svelte';
	import store from '$store';
	import Label from '@smui/common/CommonLabel.svelte';
	import Snackbar from '$lib/snackbar.svelte';
	store.dispatch('startConnectome');
	// setInterval(() => store.dispatch('snackbar', 'hello everyone'), 5000);
</script>

<Nav />
<slot />
<Snackbar />
