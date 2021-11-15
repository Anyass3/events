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
		startConnectome: ({ commit, state, dispatch }) => {
			if (!browser && state.connector) return;

			const protocol = 'anyass3/events';

			const connector = connect({ protocol, port: 7780 });
			//   const { state: store, connected } = connector;

			// console.log('store', store);
			// commit('serverStore', store);
			connector.on('ready', () => {
				connector.signal('get events');
			});
			commit('connector', connector);
			commit('connected', connector.connected);
			// store.subscribe((state) => {
			// 	commit('events', state.events);
			// 	console.log(state);
			// });

			connector.on('events', (events) => {
				console.log(events);
				dispatch('events', events);
			});
			connector.on('dmt-meetup', ({ dmtVersion, meetup }) => {
				const events = state.events
					.get()
					.map((e) => (e.meetup.meetupTitle === meetup.meetupTitle ? { dmtVersion, meetup } : e));
				dispatch('events', events);
				console.log('dmt-meetup', { dmtVersion, meetup }, events);
			});
			connector.on('notify-success', (name) => {
				console.log('notify-success', name);
			});
			connector.on('set-event successful', () => {
				dispatch('resetEvent');
			});
		}
	}
};
