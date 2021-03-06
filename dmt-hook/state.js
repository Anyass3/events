import fs from 'fs';
import path from 'path';
import { push } from 'dmt/notify';

import { def2json, json2def } from 'dmt-defjson';

import dmt from 'dmt/common';

const pushoverDefPath = path.join(dmt.userDir, 'def/pushover.def');

const { log } = dmt;

const { parseISO, formatISO, subHours, addHours, subMinutes, addMinutes } = dmt.dateFns;
const stateFilePath = path.join(dmt.dmtHerePath, 'events.json');
// state:{
//	 dmtVersion:number;
//	 events: {
//		title: string;
//		event: Array<typeof dmt.meetup>
//	 }
//}
// 💻 → 💾
// we receive clone of the state here, we can mutate it before saving.. no need to clone
function saveState({ state, lastSavedState } = {}) {
	state = JSON.stringify(state, null, 2);
	try {
		fs.writeFileSync(stateFilePath, state);
	} catch (error) {
		log.red('error', error.message);
	}
}

// 💻 ← 💾
function loadState() {
	if (fs.existsSync(stateFilePath)) {
		try {
			const state = JSON.parse(fs.readFileSync(stateFilePath, 'utf-8'));
			if (!state?.events) return { events: [] };
			const now = Date.now();
			state.events = state.events.filter(
				(ev) => new Date(addMinutes(ev.startsAtISO, ev.expectedDurationMin)).getTime() - now > 0
			);
			return state;
		} catch (e) {
			log.red(
				`⚠️  Discarding invalid persisted state for ${stateFilePath}, starting with a clean state.`
			);
			log.red(e);
			return { events: [] };
		}
	} else {
		log.yellow(`${stateFilePath} was not present, starting with a clean state.`);
		return { events: [] };
	}
}

const makeApi = (store) => {
	const timeoutIds = new Map();
	const dmtVersion = dmt.dmtVersion();
	return {
		timeoutIds,
		notify(msg) {
			const pushoverAppId = this.getEventPushoverApp()?.id;
			if (pushoverAppId) {
				push.app(pushoverAppId).notify(msg);
			} else push.notify(msg);
		},
		get: () => store.state(),
		getEvent(meetupTitle) {
			return this.get().events.find((ev) => ev.meetupTitle === meetupTitle);
		},
		getPushOverApps() {
			const { pushover } = def2json(fs.readFileSync(pushoverDefPath, 'utf-8'));
			if (!Array.isArray(pushover.app)) pushover.app = [pushover.app];
			// log.red(JSON.stringify(pushover, undefined, 2));
			return pushover;
		},
		setPushoverApp(app, update = true) {
			// log.red(JSON.stringify(app));
			const pushover = this.getPushOverApps();
			if (pushover.app.find(({ id }) => app.id !== id)) {
				pushover.app.push(app);
				const def = json2def({ pushover });
				// log.green(def);
				fs.writeFileSync(pushoverDefPath, def);
			} else if (update) {
				pushover.app.map((a) => {
					if (a.id === app._id) {
						a.id = app.id;
						a.token = app.token;
					}
					return a;
				});
			}
		},
		setEventPushoverApp(app) {
			const state = this.get();
			state['pushover'] = app;
			store.update(state);
		},
		getEventPushoverApp() {
			return this.get().pushover;
		},
		updateEvent(event) {
			const state = this.get();
			state.events = state.events.map((ev) => {
				if (event.meetupTitle === ev.meetupTitle) {
					return event;
				} else return ev;
			});
			store.update(state);
		},
		setEvent(event) {
			const ev = this.getEvent(event.meetupTitle);
			if (ev) {
				this.updateEvent(event);
			} else {
				const state = this.get();
				state.events.push(event);
				store.update(state);
			}
		},
		delEvent(meetupTitle) {
			const state = this.get();
			state.events.filter((ev) => ev.meetupTitle !== meetupTitle);
			store.update(state);
		},
		syncMeetup(channel, event, now = false) {
			if (now) channel.signal('dmt-meetup', { dmtVersion, meetup: dmt.meetup(event) });
			const self = this;

			let timeoutId = self.timeoutIds.get(event.meetupTitle);
			const mins = (new Date(event.startsAtISO) - new Date()) / 60000;
			let timeout = 60 * 60 * 1000;

			if (-1 * mins >= event.expectedDurationMin || (event.expectedDurationMin === 0 && mins === 0))
				timeout = undefined;
			if (mins < 1) timeout = 1000;
			else if (mins < 60) timeout = 60 * 1000;

			if (timeoutId) clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				channel.signal('dmt-meetup', { dmtVersion, meetup: dmt.meetup(event) });
				if (timeout) {
					self.syncMeetup(channel, event);
				} else {
					const state = this.get();
					const now = Date.now();
					state.events = state.events.filter(
						(ev) => new Date(addMinutes(ev.startsAtISO, ev.expectedDurationMin)).getTime() - now > 0
					);
					store.update(state);
				}
			}, timeout);
			self.timeoutIds.set(event.meetupTitle, timeoutId);
		}
	};
};

export { saveState, loadState, makeApi };
