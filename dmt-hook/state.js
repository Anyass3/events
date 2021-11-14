import fs from 'fs';
import path from 'path';

import dmt from 'dmt/common';
const { log } = dmt;

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
		get: () => store.state(),
		getEvent(meetupTitle) {
			return this.get().events.find((ev) => ev.meetupTitle === meetupTitle);
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
		syncMeetup(channel, event, now = false) {
			if (now) channel.signal('dmt-meetup', { dmtVersion, meetup: dmt.meetup(event) });
			const self = this;
			let timeoutId = self.timeoutIds.get(event.meetupTitle);
			const mins = (new Date() - new Date(event.startsAtISO)) / 60000;
			let timeout = 60 * 60 * 1000;
			if (mins < 1) timeout = 500;
			if (mins < 60) timeout = 60 * 1000;
			if (mins === 0) timeout = undefined;
			if (timeoutId) clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				channel.signal('dmt-meetup', { dmtVersion, meetup: dmt.meetup(event) });
				if (timeout) {
					self.syncMeetup(channel, event);
				}
			}, timeout);
			self.timeoutIds.set(event.meetupTitle, timeoutId);
		}
	};
};

export { saveState, loadState, makeApi };
