const esbuild = require('esbuild');

const formatMap = { iife: 'umd', cjs: 'cjs', esm: 'esm' };

const tslogMockPlugin = {
  name: 'tslogMock',
  setup(build) {
    let fs = require('fs');
    let path = require('path');

    // Intercept import paths called "tslog" and "util" so esbuild doesn't attempt
    // to map them to a file system location. Tag them with the "tslog-ns" or "util-ns"
    // namespace to reserve them for this plugin.
    build.onResolve({ filter: /^tslog$/ }, (args) => ({
      path: args.path,
      namespace: 'tslog-ns',
    }));

    build.onResolve({ filter: /^util$/ }, (args) => ({
      path: args.path,
      namespace: 'util-ns',
    }));

    // Load paths tagged with the "tslog-ns" and "util-ns" namespace and load related shims
    build.onLoad({ filter: /.*/, namespace: 'tslog-ns' }, async () => {
      const tslogShimsFile = await fs.promises.readFile(path.join(process.cwd(), 'tslog-shims.js'));
      return {
        contents: tslogShimsFile,
        loader: 'js',
      };
    });

    build.onLoad({ filter: /.*/, namespace: 'util-ns' }, async () => {
      const utilShimsFile = await fs.promises.readFile(path.join(process.cwd(), 'util-shims.js'));
      return {
        contents: utilShimsFile,
        loader: 'js',
      };
    });
  },
};

const buildPromises = Object.entries(formatMap).map(([format, name]) => {
  return esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    outfile: `dist/JovoWebClient.${name}.js`,
    minify: true,
    keepNames: true,
    sourcemap: true,
    treeShaking: false,
    format,
    globalName: format === 'iife' ? 'JovoWebClient' : undefined,
    plugins: [tslogMockPlugin],
  });
});

Promise.all(buildPromises).catch(() => process.exit(1));
