import { writable } from 'svelte/store';

export const getLocalDateTime = (val?) => {
	const dt = val ? new Date(val) : new Date();
	const date = dt.toLocaleDateString('en-UK').split('/').reverse().join('-');
	const time = dt.toLocaleString(undefined, {
		hourCycle: 'h23',
		timeStyle: 'short'
	});
	return `${date}T${time}`;
};
export const getEvent = () => ({
	title: '',
	expectedDuration: 60,
	startsAtISO: getLocalDateTime(),
	meetupUrl: '',
	lang: 'en'
});
export function createSnackStore() {
	const { subscribe, update, set } = writable(null);

	return {
		subscribe,
		show: (value: string, timeout = 3000) =>
			update(() => {
				setTimeout(() => set(null), timeout);
				return value;
			})
	};
}

export function __createSnackStore() {
	const { subscribe: sub, update } = writable([]);

	let count = 0;
	let restart;
	let timeoutId;
	const start = async (messages?) => {
		if (!messages) sub((v) => (messages = v))();
		timeoutId = setTimeout(() => {
			update((messages) => {
				const [message, ...rest] = messages;
				console.log('message', message);
				if (!rest.length) {
					restart = true;
					clearTimeout(timeoutId);
				}
				return rest;
			});
			if (restart) start();
		}, messages[0].timeout);
	};

	return {
		subscribe: (run: (value) => void, invalidate?: any) => {
			return sub((messages) => {
				const message = messages[0] ? messages[0].message + ' ' + count : undefined;
				// console.log('message', messages[0]);
				run(message);
			}, invalidate);
		},
		show: (message: string, { wait = true, timeout = 5000 } = {}) => {
			update((messages) => {
				if (wait) messages.push({ message, timeout, count });
				else messages = [{ message, timeout, count }];
				return messages;
			});
			count++;
			if (restart || restart === undefined) {
				start();
				restart = false;
			}
			// console.log('show', { message, timeout, count });
		}
	};
}
