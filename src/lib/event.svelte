<script lang="ts">
	import store from '$store';
	import TextField from '@smui/textfield/Textfield.svelte';
	import Button from '@smui/button/Button.svelte';
	const event = store.g('event');
	$: console.log('event', $event);

	let update = !!$event.name;
</script>

<div class="flex flex-col">
	<TextField bind:value={$event.title} label="Title" />
	<TextField bind:value={$event.startsAtISO} label="Event Time" type="datetime-local" />
	<TextField bind:value={$event.lang} label="Locale" />
	<TextField bind:value={$event.expectedDuration} label="Expected Duration (mins)" />
	<TextField bind:value={$event.meetupUrl} label="Event Link" type="url" />
	<div>
		<Button on:click={() => store.dispatch('setEvent')}
			>{(update ? 'Update' : 'Set') + ' Event'}</Button
		>
	</div>
</div>
