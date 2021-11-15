<script>
	import store from '$store';
	import TextField from '@smui/textfield/Textfield.svelte';
	import Button from '@smui/button/Button.svelte';
	const event = store.g('event');
	// $: console.log('event', $event);
	const getLocalDateTime = (val) => {
		const dt = new Date(val || Date.now());
		const time = dt.toLocaleString(undefined, {
			hourCycle: 'h24',
			timeStyle: 'short'
		});
		const month = String(dt.getMonth()).padStart(2, '0');
		const date = String(dt.getDate()).padStart(2, '0');
		return `${dt.getFullYear()}-${month}-${date}T${time}`;
	};
	const setTime = (dateTime) => {
		console.log('dateTime', dateTime);
		if (typeof dateTime === 'string') {
			dateTime = dateTime.replace('T24', 'T00');
			$event.startsAtISO = new Date(dateTime).toISOString();
		}
	};
	let update = !!$event.name;
	let eventTime;
	eventTime = getLocalDateTime($event.startsAtISO);
	$: setTime(eventTime);
</script>

<div class="flex flex-col">
	<TextField bind:value={$event.title} label="Title" />
	<TextField bind:value={eventTime} label="Event Time" type="datetime-local" />
	<TextField bind:value={$event.lang} label="Locale" />
	<TextField bind:value={$event.expectedDuration} label="Expected Duration (mins)" />
	<TextField bind:value={$event.meetupUrl} label="Event Link" type="url" />
	<Button on:click={() => store.dispatch('setEvent')}
		>{(update ? 'Update' : 'set') + ' Event'}</Button
	>
</div>
