import dmt from 'dmt/common';
import { push } from 'dmt/notify';
import onConnect from './onConnect';
import { ProgramStateStore } from 'dmt/connectome-stores';

import { saveState, loadState, makeApi } from './state';

export default function initProtocol({ program }) {
	const dmtVersion = dmt.dmtVersion();
	const store = new ProgramStateStore(undefined, { saveState, loadState });
	const api = makeApi(store);
	const protocol = 'anyass3/events';

	const channelList = program.registerProtocol({
		protocol,
		onConnect: ({ channel }) => {
			onConnect({ channel, api, dmtVersion });
		}
	});
}

function init(program) {
	initProtocol({ program });
}

export { init };
