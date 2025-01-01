module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
	theme: {
		extend: {},
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: ['dark', 'nord', 'dracula', 'night', 'dim', 'corporate', 'coffee','synthwave'],
	},
};
