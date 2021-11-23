/// <reference types="@sveltejs/kit" />

interface ImportMetaEnv {
	BASE_URL: string;
}
interface ImportMeta {
	env: ImportMetaEnv;
}
