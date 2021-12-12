import { browser } from '$app/env';
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
			connector.on('dmt-meetup', ({ dmtVersion, meetup, timeout, mins }) => {
				// dispatch('snackbar', 'set-event successful');

				console.log('openSnackbar', meetup.meetupTitle, timeout, mins);
				const events = state.events
					.get()
					.filter((e) => e.meetup.meetupTitle !== meetup.meetupTitle)
					.concat([{ dmtVersion, meetup }]);
				dispatch('events', events);
				// console.log('dmt-meetup', { dmtVersion, meetup }, events);
			});
			connector.on('pushover', (pushover) => {
				dispatch('pushover', pushover);
			});
			connector.on('event-pushover-app', (pushoverApp) => {
				dispatch('pushoverApp', pushoverApp);
			});
			connector.on('notify-success', (msg) => {
				dispatch('snackbar', msg);
			});
			connector.on('set-event successful', () => {
				dispatch('snackbar', 'Set Event Successful');
				dispatch('resetEvent');
			});
		}
	}
};
