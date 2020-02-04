module.exports = {
  devServer: {
    https: true,
  },
  chainWebpack: (config) => {
    config.resolve.symlinks(false);
  },
};
