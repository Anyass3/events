import dmt from 'dmt/common';
import { push } from 'dmt/notify';
const { parseISO, formatISO, subHours, addHours, subMinutes, addMinutes } = dmt.dateFns;

function handleEvents({ channel, api, dmtVersion }) {
	channel.on('set-event', ({ startsAtISO, meetupUrl, lang = 'en', name }) => {
		push.notify('an event set');
		const state = {
			dmtVersion,
			meetup: dmt.meetup({
				startsAtISO: formatISO(new Date(startsAtISO)),
				meetupUrl,
				meetupTitle: name
			})
		};
		channel.signal('notify-success', { startsAtISO, meetupUrl, lang, name, state });
		api.setEvent({
			name,
			state
		});
	});
	channel.on('disconnect', () => {
		push.notify('events disconnected');
	});
}

export default handleEvents;
