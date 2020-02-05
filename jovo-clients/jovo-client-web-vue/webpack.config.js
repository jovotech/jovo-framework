const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

function createConfig(target, targetName = target) {
  return {
    entry: './src/index.ts',
    devtool: process.env.NODE_ENV === 'development' ? 'inline-source-map' : '',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: `index.${targetName}.js`,
      library: 'JovoWebClientVue',
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
    externals: {
      vue: {
        commonjs: 'vue',
        commonjs2: 'vue',
        root: 'Vue',
      },
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            mangle: false,
          },
          extractComments: false,
        }),
      ],
    },
  };
}

module.exports = [createConfig('commonjs2', 'common'), createConfig('umd')];
