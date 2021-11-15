const esbuild = require('esbuild');

const formatMap = { iife: 'umd', cjs: 'common', esm: 'esm' };

const buildPromises = Object.entries(formatMap).map(([format, name]) => {
  return esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    outfile: `dist/JovoWebClient.${name}.js`,
    minify: true,
    sourcemap: true,
    format,
    globalName: format === 'iife' ? 'JovoWebClient' : undefined,
  });
});

Promise.all(buildPromises).catch(() => process.exit(1));
