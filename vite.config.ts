import { sveltekit } from '@sveltejs/kit/vite'
import autoprefixer from 'autoprefixer'
import { defineConfig } from 'vite'

const DEV = process.env.NODE_ENV === 'development'

export default defineConfig({
	plugins: [sveltekit()],
	build: { sourcemap: DEV },
	server: { allowedHosts: [] },
	css: {
		postcss: { plugins: [autoprefixer()] },
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}', 'scripts/**/*.{test,spec}.{js,ts}'],
	},
})
