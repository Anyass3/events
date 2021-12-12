<script>
	import Select from '$lib/select.svelte';
	import store from '$store';
	const pushover = store.g('pushover');
	const pushoverApp = store.g('pushoverApp');
	const snackbar = store.g('snackbar');
	const connector = store.g('connector');
	import TextField from '@smui/textfield/Textfield.svelte';
	import Button from '@smui/button/Button.svelte';
	import { onDestroy } from 'svelte';
	let selected;
	const unsub = pushoverApp.subscribe((app) => (selected = app));
	onDestroy(unsub);
	let app = { id: '', token: '' };
</script>

<label for="select-pushover" class="capitalize text-3xl">Select pushover notification account</label
>

<Select
	id="select-pushover"
	bind:selected
	items={$pushover.app}
	on:change={() => {
		console.log(selected);
		if (selected.id && selected.token.match(/[a-z0-9]{30}/)) {
			connector.signal('set-event-pushover-app', selected);
		} else snackbar.show('Please cross-check selected');
	}}
/>

<div class="pt-16 flex flex-col gap-3">
	<h3 class="capitalize text-3xl">or add pushover app</h3>
	<TextField bind:value={app.id} label="Name" />
	<TextField bind:value={app.token} label="API Token/Key" />
	<div>
		<Button
			on:click={() => {
				if (app.id && app.token.match(/[a-z0-9]{30}/)) {
					connector.signal('set-pushover-app', { app });
					app.id = '';
					app.token = '';
				} else snackbar.show('Please cross-check inputs');
			}}>Add Pushover</Button
		>
	</div>
</div>

<style>
</style>
