import { getEvent, getLocalDateTime, createSnackStore } from './utils';
export default {
	noStore: ['base_url', 'snackbar'],
	state: {
		events: [],
		event: getEvent(),
		base_url: import.meta.env.BASE_URL.replace('_app/', ''),
		snackbar: createSnackStore(),
		pushover: { app: [] },
		pushoverApp: undefined
	},
	mutations: {
		event(state, event) {
			event.startsAtISO = getLocalDateTime(event.startsAtISO);
			console.log(event);
			state.event.set(event);
		},
		snackbar(state, message, timeout) {
			state.snackbar.show(message, timeout);
		}
	},
	actions: {
		resetEvent({ commit }) {
			commit('event', getEvent());
		},
		events({ commit }, events) {
			events.sort((a, b) => a.meetup.startsAtUnixTimestamp - b.meetup.startsAtUnixTimestamp);
			commit('events', events);
		},
		setEvent({ dispatch, state }) {
			const event = state.event.get();
			event.startsAtISO = new Date(event.startsAtISO).toISOString();
			state.connector.signal('set-event', event);
		}
	}
};
