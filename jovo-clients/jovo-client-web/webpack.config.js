const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, ctx) => {
  function createConfig(target, targetName = target) {
    const plugins = [new CleanWebpackPlugin({ cleanStaleWebpackAssets: false })];

    if (ctx.mode === 'development' && target === 'umd') {
      plugins.push(
        new HtmlWebpackPlugin({
          title: 'Jovo Web Client',
          template: 'index.html',
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
      plugins,
    };
  }

  return [createConfig('umd'), createConfig('commonjs2', 'common')];
};
