import dmt from 'dmt/common';
import { push } from 'dmt/notify';
const { parseISO, formatISO, subHours, addHours, subMinutes, addMinutes } = dmt.dateFns;

function handleEvents({ channel, api, dmtVersion }) {
	channel.signal('pushover', api.getPushOverApps());
	channel.signal('event-pushover-app', api.getEventPushoverApp());
	channel.on('set-event', ({ startsAtISO, meetupUrl, lang = 'en', expectedDuration, title }) => {
		startsAtISO = formatISO(new Date(startsAtISO));
		const event = {
			startsAtISO,
			meetupUrl,
			lang,
			expectedDurationMin: expectedDuration,
			stillAllowJoinAfterExpectedEndMin: expectedDuration,
			meetupTitle: title
		};
		api.setEvent(event);
		channel.signal('set-event successful');
		api.syncMeetup(channel, event, true);
		push.notify('EVENT Updated: ' + title);
	});

	channel.on('set-pushover-app', ({ app, update = false }) => {
		api.setPushoverApp(app, update);
		channel.signal('notify-success', app.id + ' pushover app set');
		channel.signal('pushover', api.getPushOverApps());
	});

	channel.on('set-event-pushover-app', (app) => {
		api.setEventPushoverApp(app);
		channel.signal('notify-success', app.id + ' is current pushover app');
		channel.signal('event-pushover-app', api.getEventPushoverApp());
	});

	channel.on('get events', () => {
		const events = api.get().events.map((event) => ({ dmtVersion, meetup: dmt.meetup(event) }));
		channel.signal('events', events);
	});

	api.get().events.forEach((event) => api.syncMeetup(channel, event));
	channel.on('disconnect', () => {
		push.notify('events disconnected');
	});
}

export default handleEvents;
