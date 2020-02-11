module.exports = {
  devServer: {
    https: true,
  },
  // publicPath: '/chat/',
  chainWebpack: (config) => {
    config.resolve.symlinks(false);
  },
};
