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
	fs.writeFileSync(JSON.stringify(state, null, 2));
}

// 💻 ← 💾
function loadState() {
	if (fs.existsSync(stateFilePath)) {
		try {
			return JSON.parse(fs.readFileSync(stateFilePath));
		} catch (e) {
			log.red(
				`⚠️  Discarding invalid persisted state for ${stateFilePath}, starting with a clean state.`
			);
			log.red(e);
		}
	} else {
		log.yellow(`${stateFilePath} was not present, starting with a clean state.`);
	}
}

const makeApi = (store) => ({
	get: () => store.state(),
	getEvent: (name) => {
		return this.get().events.find((ev) => ev.name === name);
	},
	updateEvent: (event) => {
		const state = this.get();
		state.events = state.events.map((ev) => {
			if (event.name === ev.name) {
				return event;
			} else return ev;
		});
		store.update(state);
	},
	setEvent: (event) => {
		const ev = this.getEvent(event.name);
		if (ev) {
			this.updateEvent(event);
		} else {
			const state = this.get();
			state.events.push(event);
			store.update(state);
		}
	}
});

export { saveState, loadState, makeApi };
