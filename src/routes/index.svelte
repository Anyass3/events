<script lang="ts">
	import Meetup from 'dmt-frontend-components/src/components/Meetup.svelte';
	import store from '$store';
	import { get, writable, Writable } from 'svelte/store';
	const events: Writable<Record<string, Record<string, any>>[]> = store.g('events');
</script>

<div class="view">
	<div class=" flex flex-col justify-between">
		{#each $events as state}
			<Meetup state={writable(state)} padding="20px" />
		{/each}
		{#if !$events.length}
			<p class="text-center">No upcomming events</p>
		{/if}
	</div>
</div>
