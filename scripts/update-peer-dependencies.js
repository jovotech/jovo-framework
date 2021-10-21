const fs = require('fs');
const { PackageGraph } = require('@lerna/package-graph');
const { Project } = require('@lerna/project');
const { getFilteredPackages } = require('@lerna/filter-options');
const { join, relative } = require('path');
const log = require('npmlog');

function getPackagesWithPeerDependency(packages, peerDependencyName) {
  return packages.filter((pkg) => pkg.peerDependencies && pkg.peerDependencies[peerDependencyName]);
}

async function updatePeerDependents(cwd, packages, name) {
  const peerDependencyPackage = packages.find((pkg) => pkg.name === name);

  if (!peerDependencyPackage) {
    throw new Error(`Can not update peerDependencies, could not find ${name}`);
  }

  log.info('peer', 'Updating %s peer-dependency to %s', name, peerDependencyPackage.version);

  const filteredPackages = getPackagesWithPeerDependency(packages, name);
  console.log(
    name,
    filteredPackages.map((pkg) => pkg.name),
  );

  const promises = filteredPackages.map((pkg) => {
    pkg.peerDependencies[name] = peerDependencyPackage.version;
    return pkg.serialize();
  });
  await Promise.all(promises);
}

async function updateFrameworkPeerDependents(cwd, packages) {
  return updatePeerDependents(cwd, packages, '@jovotech/framework');
}

async function updateOutputPeerDependents(cwd, packages) {
  return updatePeerDependents(cwd, packages, '@jovotech/output');
}

(async () => {
  const cwd = join(__dirname, '..');
  const project = new Project(cwd);
  const packages = await project.getPackages();
  const packageGraph = new PackageGraph(packages);

  await Promise.all([
    updateFrameworkPeerDependents(cwd, packages, packageGraph),
    updateOutputPeerDependents(cwd, packages, packageGraph),
  ]);
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
