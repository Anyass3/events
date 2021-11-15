import dmt from 'dmt/common';
import { push } from 'dmt/notify';
const { parseISO, formatISO, subHours, addHours, subMinutes, addMinutes } = dmt.dateFns;

function handleEvents({ channel, api, dmtVersion }) {
	channel.on('set-event', ({ startsAtISO, meetupUrl, lang = 'en', expectedDuration, title }) => {
		startsAtISO = formatISO(new Date(startsAtISO));
		const event = {
			startsAtISO,
			meetupUrl,
			lang,
			expectedDurationMin: expectedDuration,
			meetupTitle: title
		};
		api.setEvent(event);
		channel.signal('set-event succesful');
		api.syncMeetup(channel, event, true);
		push.notify('EVENT Updated: ' + title);
	});

	channel.on('get events', () => {
		events = events.map((event) => ({ dmtVersion, meetup: dmt.meetup(event) }));
		channel.signal('events', events);
	});

	api.get().events.forEach((event) => api.syncMeetup(channel, event));
	channel.on('disconnect', () => {
		push.notify('events disconnected');
	});
}

export default handleEvents;
