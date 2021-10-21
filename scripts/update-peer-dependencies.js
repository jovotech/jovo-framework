const fs = require('fs');
const { PackageGraph } = require('@lerna/package-graph');
const { Project } = require('@lerna/project');
const { getFilteredPackages } = require('@lerna/filter-options');
const { join, relative } = require('path');
const log = require('npmlog');

(async () => {
  const cwd = join(__dirname, '..');
  const project = new Project(cwd);
  const packages = await project.getPackages();
  const packageGraph = new PackageGraph(packages);

  const frameworkPackage = packages.find((pkg) => pkg.name === '@jovotech/framework');

  if (!frameworkPackage) {
    throw new Error(`Can not update peerDependencies, could not find @jovotech/framework`);
  }

  log.info('peer', 'Updating @jovotech/framework peer-dependency to %s', frameworkPackage.version);

  const filteredPackages = await getFilteredPackages(
    packageGraph,
    { cwd },
    {
      ignore: [
        '@jovotech/common',
        '@jovotech/framework',
        '@jovotech/output',
        '@jovotech/output-*',
        '@jovotech/e2e',
        '@jovotech/examples-*',
      ],
    },
  );

  const promises = filteredPackages.map((pkg) => {
    pkg.peerDependencies['@jovotech/framework'] = frameworkPackage.version;
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
