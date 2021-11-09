import { browser } from '$app/env'; // @ts-ignore
import { ConnectedStore } from 'connectome/stores';
// import { port } from './getAPi';

export default {
	noStore: true,
	state: {
		connector: null,
		serverStore: null,
		serverApi: null,
		connected: null
	},
	actions: {
		startConnectome: ({ commit }) => {
			if (!browser) return;
			const address = window.location.hostname;

			const protocol = 'dmt';

			const lane = 'events';

			const store = new ConnectedStore({ protocol, port: 7780, lane });
			// console.log('store', store);
			commit('serverStore', store);
			commit('connector', store.connector);
			commit('connected', store.connected);
			store.subscribe((state) => {
				commit('events', state.events);
				console.log(state);
			});
			// commit('serverApi', store.remoteObject?.bind?.(store)?.('dmt:events'));
			store.connector.on('notify-success', (name) => {
				console.log('notify-success', name);
			});
		}
	}
};
