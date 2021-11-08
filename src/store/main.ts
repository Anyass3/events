const event = {
	name: '',
	startsAtISO: undefined,
	meetupUrl: '',
	lang: 'en'
};
export default {
	noStore: ['base_url'],
	state: {
		event,
		base_url: import.meta.env.BASE_URL.replace('_app/', '')
	},
	actions: {
		resetEvent({ commit }) {
			commit('event', event);
		}
	}
};
