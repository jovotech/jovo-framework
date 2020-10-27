const path = require('path');
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
    return {
      entry: './src/index.ts',
      devtool: process.env.NODE_ENV === 'development' ? 'inline-source-map' : 'source-map',
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
          amd: 'vue',
          commonjs: 'vue',
          commonjs2: 'vue',
          root: 'Vue',
        },
      },
    };
  }

  return [createConfig('commonjs2', 'common'), createConfig('umd')];
};
