const path = require('path');

function createConfig(target, targetName = target) {
	return {
		mode: 'development',
		entry: './src/index.ts',
		devtool: 'inline-source-map',
		output: {
			path: path.resolve(__dirname, 'dist/src'),
			filename: `index.${targetName}.js`,
			library: 'JovoWebClient',
			libraryTarget: target,
		},
		module: {
			rules: [
				{
					test: /\.ts$/,
					use: 'ts-loader',
					exclude: /node_modules/
				}
			]
		},
		resolve: {
			extensions: ['.ts', '.js']
		}
	};
}

module.exports = [
	createConfig('commonjs2', 'common'),
	createConfig('umd')
];
