<script lang="ts">
	import Meetup from 'dmt-frontend-components/src/components/Meetup.svelte';
	import store from '$store';
	import { get, writable, Writable } from 'svelte/store';
	export let state;

	$: _state = writable(state);
	const meetupClickHandler = () => {};
</script>

<div class="my-2 py-2 rounded">
	<Meetup {meetupClickHandler} state={_state} padding="0px" />
</div>

<style>
	div {
		background: rgb(35, 34, 56);
	}
</style>
