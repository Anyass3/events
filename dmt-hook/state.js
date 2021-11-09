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
	log.green(state);
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

const makeApi = (store) => ({
	get: () => store.state(),
	getEvent(name) {
		return this.get().events.find((ev) => ev.name === name);
	},
	updateEvent(event) {
		const state = this.get();
		state.events = state.events.map((ev) => {
			if (event.name === ev.name) {
				return event;
			} else return ev;
		});
		store.update(state);
	},
	setEvent(event) {
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
