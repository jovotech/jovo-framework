const esbuild = require('esbuild');

const formatMap = { iife: 'umd', cjs: 'cjs', esm: 'esm' };

const tslogMockPlugin = {
  name: 'tslogMock',
  setup(build) {
    let fs = require('fs');
    let path = require('path');

    // Intercept import paths called "JovoLogger" so esbuild doesn't attempt
    // to map them to a file system location. Tag them with the "JovoLogger-ns"
    // namespace to reserve them for this plugin.
    build.onResolve({ filter: /^[.][/]JovoLogger$/ }, (args) => {
      return {
        path: args.path,
        namespace: 'JovoLogger-ns',
      };
    });

    build.onLoad({ filter: /.*/, namespace: 'JovoLogger-ns' }, async () => {
      const jovoLoggerShimsFile = await fs.promises.readFile(
        path.join(process.cwd(), 'JovoLogger-shims.js'),
      );
      return {
        contents: jovoLoggerShimsFile,
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
