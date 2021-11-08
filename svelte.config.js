import preprocess from 'svelte-preprocess';
import { resolve } from 'path';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true
		})
	],

	kit: {
		adapter: adapter({
			pages: 'build/frontend',
			assets: 'build/frontend',
			fallback: null
		}),
		ssr: false,
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		vite: {
			resolve: {
				alias: {
					$store: resolve('src/store'),
					icons: resolve('node_modules/svelte-feather-icons/src/icons'),
					// 'dmt-components': resolve('node_modules/dmt-frontend-components'),
					$icons: resolve('src/icons')
				}
			}
		}
	}
};

export default config;
