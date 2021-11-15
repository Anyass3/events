<script lang="ts">
	import Meetup from '$lib/meetup.svelte';
	import store from '$store';
	import type { Writable } from 'svelte/store';
	const events: Writable<Record<string, Record<string, any>>[]> = store.g('events');
</script>

<div class="view">
	<div class=" flex flex-col justify-between">
		{#key $events}
			{#each $events as state}
				<Meetup {state} />
			{/each}
		{/key}
		{#if !$events.length}
			<p class="text-center">No upcomming events</p>
		{/if}
	</div>
</div>
