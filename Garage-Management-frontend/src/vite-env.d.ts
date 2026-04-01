/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_API_URL?: string;
	readonly VITE_DEFAULT_CURRENCY?: 'USD' | 'EUR' | 'GBP' | 'INR';
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
