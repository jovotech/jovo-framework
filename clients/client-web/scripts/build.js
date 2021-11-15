const esbuild = require('esbuild');

const formatMap = { iife: 'umd', cjs: 'cjs', esm: 'esm' };

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
  });
});

Promise.all(buildPromises).catch(() => process.exit(1));
