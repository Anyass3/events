<script>
	import Label from '@smui/common/CommonLabel.svelte';
	import Tab from '@smui/tab/Tab.svelte';
	import TabBar from '@smui/tab-bar/TabBar.svelte';
	import Button from '@smui/button/Button.svelte';
	import store from '$store';
	const connected = store.g('connected');
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	const base_url = store.g('base_url');
	const tabs = [
		{ name: 'events', href: base_url },
		{ name: 'set event', href: base_url + 'set-event' },
		{ name: 'settings', href: base_url + 'settings' }
	];
	let active = tabs.find((t) => t.href === $page.path);
</script>

<div class="view py-6 ">
	<TabBar {tabs} let:tab bind:active>
		<!-- Note: the `tab` property is required! -->
		<Tab {tab} on:click={() => goto(tab.href)}>
			<Label class="capitalize">{tab.name}</Label>
		</Tab>
	</TabBar>
	<!-- <a
		class={$connected ? 'connected' : 'disconnected'}
		href={base_url}
		sveltekit:prefetch
		class:active={$page.path === base_url + '/'}>Events</a
	>
	<a
		class={$connected ? 'connected' : 'disconnected'}
		sveltekit:prefetch
		class:active={$page.path === base_url + 'set-event'}
		href="/set-event">set event</a
	>
	<a
		class={$connected ? 'connected' : 'disconnected'}
		sveltekit:prefetch
		class:active={$page.path === base_url + 'settings'}
		href="/settings">Settings</a
	> -->
</div>

<style>
	.connected {
		color: var(--dmt-cyan);
	}
	.disconnected {
		color: var(--dmt-gray);
	}
	.active {
		color: var(--zeta-green);
	}
</style>
