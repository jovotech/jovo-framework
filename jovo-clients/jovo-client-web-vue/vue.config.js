module.exports = {
  pluginOptions: {},
  devServer: {
    https: true,
  },
  outputDir: 'dist/src',
  chainWebpack: (config) => {
    config.resolve.symlinks(false);
    // config.optimization.minimize(false);
  },
  configureWebpack: {
    output: {
      library: 'JovoWebClientVue',
    }
  }
};
