import dmt from 'dmt/common';
import { push } from 'dmt/notify';

function handleEvents({ channel, api }) {
	channel.on('set-event', ({ startsAtISO, meetupUrl, lang = 'en', name }) => {
		push.notify('added an event');
		const event = { name, state: dmt.meetup({ startsAtISO, meetupUrl, lang }) };
		api.setEvent(event);
		channel.signal('notify-success', name);
	});
	channel.on('disconnect', () => {
		push.notify('events disconnected');
	});
}

export default handleEvents;
