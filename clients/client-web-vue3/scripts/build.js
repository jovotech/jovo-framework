const esbuild = require('esbuild');

const formatMap = { iife: 'umd', cjs: 'common', esm: 'esm' };

const buildPromises = Object.entries(formatMap).map(([format, name]) => {
  return esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    outfile: `dist/JovoWebClientVue.${name}.js`,
    minify: true,
    sourcemap: true,
    format,
    globalName: format === 'iife' ? 'JovoWebClientVue' : undefined,
    external: ['@jovotech/common'],
  });
});

Promise.all(buildPromises).catch(() => process.exit(1));
