import dmt from 'dmt/common';
import { push } from 'dmt/notify';
import onConnect from './onConnect';
import { ProgramStateStore, MirroringStore } from 'dmt/connectome-stores';

import { saveState, loadState, makeApi } from './state';

export default function initProtocol({ program }) {
	const store = new ProgramStateStore({ dmtVersion, events: [] }, { saveState, loadState });
	const api = makeApi(store);
	const onConnect = ({ channel }) => {
		setTimeout(() => channel.signal('notify-success', 'channel connected'), 5000);
		handleEvents({ channel, api });
	};

	const protocol = 'dmt';
	const lane = 'events';
	const channelList = program.registerProtocol({ protocol, lane, onConnect });

	const dmtVersion = dmt.dmtVersion();

	store.mirror(channelList);
}

function init(program) {
	initProtocol({ program });
}

export { init };
