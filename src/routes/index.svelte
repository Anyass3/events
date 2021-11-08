<script>
	import Meetup from 'dmt-frontend-components/src/components/Meetup.svelte';
	import store from '$store';
	const connected = store.g('connected');
	let events = [];
</script>

<div class="view">
	<div class=" flex flex-col justify-between">
		{#each events as event}
			<Meetup {...event} />
		{/each}
		{#if !events.length}
			<p class="text-center">No upcomming events</p>
		{/if}
	</div>
</div>
