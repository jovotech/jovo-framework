const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const analyzeBundle = process.env.ANALYZE_BUNDLE || false;

const plugins = [];
if (analyzeBundle) {
  plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      analyzerHost: 'localhost',
      analyzerPort: 4000,
    }),
  );
}

function createConfig(target, targetName = target) {
  return {
    entry: './src/index.ts',
    devtool: process.env.NODE_ENV === 'development' ? 'inline-source-map' : '',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: `index.${targetName}.js`,
      library: 'JovoWebClient',
      libraryTarget: target,
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    plugins,
  };
}

module.exports = [createConfig('commonjs2', 'common'), createConfig('umd')];
