const { PackageGraph } = require('@lerna/package-graph');
const { Project } = require('@lerna/project');
const { getFilteredPackages } = require('@lerna/filter-options');
const { join } = require('path');

const SCRIPTS_MAP = {
  prebuild: 'rimraf dist',
  build:
    'tsc -b tsconfig.build.cjs.json tsconfig.build.esm5.json tsconfig.build.esm2015.json tsconfig.build.types.json',
  watch:
    'tsc -b tsconfig.build.cjs.json tsconfig.build.esm5.json tsconfig.build.esm2015.json tsconfig.build.types.json --watch',
};

(async () => {
  const cwd = join(__dirname, '..');
  const project = new Project(cwd);
  const packages = await project.getPackages();
  const packageGraph = new PackageGraph(packages);
  const filteredPackages = await getFilteredPackages(
    packageGraph,
    { cwd },
    { ignore: ['@jovotech/e2e', '@jovotech/examples-*', '@jovotech/client-*'] },
  );

  const promises = filteredPackages.map((pkg) => {
    // SCRIPTS_MAP first in order to make prebuild the first element (small hack)
    const mergedScripts = { ...SCRIPTS_MAP, ...pkg.scripts, ...SCRIPTS_MAP };
    pkg.set('scripts', mergedScripts);
    return pkg.serialize();
  });
  await Promise.all(promises);
})()
  .then(() => {
    console.log('Success');
    process.exit(0);
  })
  .catch((e) => {
    console.error('Failure');
    console.error((e.stdout || e.message).trim());
    console.error(e.stack);
    process.exit(1);
  });
