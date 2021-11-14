import { browser } from '$app/env'; // @ts-ignore
import { connect } from 'connectome';
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

			const protocol = 'anyass3/events';

			const connector = connect({ protocol, port: 7780 });
      const { state: store, connected } = connector;

			// console.log('store', store);
			commit('serverStore', store);
			commit('connector', connector);
			commit('connected', connected);
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
