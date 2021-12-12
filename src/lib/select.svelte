<script lang="ts">
	import SearchIcon from 'icons/SearchIcon.svelte';
	import ChevronDownIcon from 'icons/ChevronDownIcon.svelte';
	import { createEventDispatcher } from 'svelte';
	export let items: { id: string; token: string; src: string }[] = [],
		id = 'select',
		focused = false,
		selected = undefined;
	$: options = items;
	const dispatch = createEventDispatcher();

	const clickOutside = (ev) => {
		const el = ev.path.find((el) => el.id === 'select-pushover');
		if (!el) {
			focused = false;
			selected = selected;
		}
	};
	const filter = (ev) => {
		const searchKey = ev.target?.value?.toLowerCase() || '';
		if (searchKey) options = items.filter(({ id }) => id.toLowerCase().includes(searchKey));
		else options = items;
	};
	let search = false;
	let changedKey;
</script>

<svelte:body on:click={clickOutside} />
<div {id} class="relative border-2 transition rounded mt-2" class:focused>
	<div class="flex-grow flex items-center py-1 px-4">
		{#key changedKey}
			{#if !selected || search}
				<div class="icon">
					<SearchIcon size="1x" />
				</div>
			{:else if selected.src}
				<img src={selected.src} class=" rounded-full w-4 h-4 inline-block" alt="" />
			{/if}
			{#key selected}
				<input
					type="text"
					class="p-2 focus:outline-none flex-grow w-full"
					style="background-color: inherit;"
					class:active={selected?.id}
					placeholder={focused ? 'start entering the pushover app' : 'Select pushover app'}
					on:keyup={filter}
					value={selected?.id || ''}
					on:focus={() => (focused = true)}
				/>
			{/key}
		{/key}
		<div class="icon">
			<ChevronDownIcon size="1x" />
		</div>
	</div>
	{#if focused}
		<div class=" absolute w-full mt-1 focused p-2 z-20 rounded">
			{#each options as option}
				<div
					class="p-2 flex justify-between w-full  rounded-sm shadow"
					tabindex="-1"
					on:click={() => {
						selected = option;
						focused = false;
						dispatch('change');
						changedKey = Math.random();
					}}
				>
					<div>
						{#if option.src}
							<img src={option.src} class=" rounded-full w-4 h-4 inline-block" alt="" />
						{/if}
						<span>{option.id}</span>
					</div>
					<div class="text-xs">{option.token}</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.focused {
		@apply bg-gray-600;
	}
	.active {
		@apply text-2xl font-medium;
		color: var(--dmt-cyan);
	}
</style>
