import { browser } from '$app/env'; // @ts-ignore
import { connectBrowser } from 'connectome';
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
			if (!browser) return;
			const address = window.location.hostname;

			const protocol = 'dmt';

			const lane = 'events';

			const connector = connectBrowser({ protocol, port: 7780, lane });
			commit('connector', connector);
			connector.on('ready', () => {
				connector.signal('get events');
			});
			connector.on('events', (events) => {
				console.log(events);
				commit('events', events);
			});
			connector.on('dmt-meetup', ({ dmtVersion, meetup }) => {
				const events = state.events
					.get()
					.map((e) => (e.meetup.meetupTitle === meetup.meetupTitle ? { dmtVersion, meetup } : e));
				commit('events', events);
				console.log('dmt-meetup', events);
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
