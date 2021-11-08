<script>
	import '$lib/app.css';
	import '$lib/smui-dark.css';
	import 'tailwindcss/tailwind.css';
	import Nav from '$lib/nav.svelte';
	import store from '$store';
	store.dispatch('startConnectome');
</script>

<Nav />
<slot />
