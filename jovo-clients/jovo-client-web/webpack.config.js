const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const rimraf = require('rimraf');

function asyncRimraf(removePath, opts = {}) {
  return new Promise((resolve, reject) => {
    rimraf(removePath, opts, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

module.exports = async (env, ctx) => {
  await asyncRimraf('dist');

  function createConfig(target, targetName = target) {
    const plugins = [];

    if (ctx.mode === 'development' && target === 'umd') {
      plugins.push(
        new HtmlWebpackPlugin({
          title: 'Jovo Web Client',
          template: 'index.html',
          inject: false,
        }),
      );
    }

    if (env && env.ANALYZE_BUNDLE === 'true') {
      plugins.push(
        new BundleAnalyzerPlugin({
          reportFilename: `report-${targetName}.html`,
          analyzerMode: 'static',
          analyzerHost: 'localhost',
          analyzerPort: 4000,
        }),
      );
    }
    return {
      mode: ctx.mode || 'production',
      entry: './src/index.ts',
      devtool: ctx.mode === 'development' ? 'inline-source-map' : 'source-map',
      devServer: {
        contentBase: './dist',
      },
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
      externals: {},
      plugins,
    };
  }

  return [createConfig('umd'), createConfig('commonjs2', 'common')];
};
