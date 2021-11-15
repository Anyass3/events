const event = {
	title: '',
	expectedDuration: 60,
	startsAtISO: undefined,
	meetupUrl: '',
	lang: 'en'
};
export default {
	noStore: ['base_url'],
	state: {
		events: [],
		event,
		base_url: import.meta.env.BASE_URL.replace('_app/', '')
	},
	actions: {
		resetEvent({ commit }) {
			commit('event', event);
		},
		events({ commit }, events) {
			events.sort((a, b) => a.meetup.startsAtUnixTimestamp - b.meetup.startsAtUnixTimestamp);
			commit('events', events);
		},
		setEvent({ dispatch, state }) {
			state.connector.signal('set-event', state.event.get());
		}
	}
};
