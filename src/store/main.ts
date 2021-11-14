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
		setEvent({ dispatch, state }) {
			state.connector.signal('set-event', state.event.get());
		}
	}
};
