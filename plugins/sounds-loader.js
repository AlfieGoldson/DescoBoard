const virtual = require('@rollup/plugin-virtual');
const fs = require('fs');

function parseSoundsDirectory() {
	return fs.readdirSync('./public/assets/sounds').map(
		(f) => `
		{
			title: '${f.split('.')[0]}',
			length: '00:48',
			path: '/assets/sounds/${f}',
		}`
	);
}

module.exports = function () {
	const sounds = parseSoundsDirectory();
	const moduleContent = `export const sounds = [${sounds.join(', \n')}];`;

	const configureServer = [
		async ({ app }) => {
			app.use(async (ctx, next) => {
				if (ctx.path.startsWith('/@modules/soundboard-loader')) {
					ctx.type = 'js';
					ctx.body = moduleContent;
				} else await next();
			});
		},
	];

	const rollupInputOptions = {
		plugins: [virtual({ 'soundboard-loader': moduleContent })],
	};

	return { configureServer, rollupInputOptions };
};
