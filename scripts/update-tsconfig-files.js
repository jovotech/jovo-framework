const fs = require('fs');
const { PackageGraph } = require('@lerna/package-graph');
const { Project } = require('@lerna/project');
const { getFilteredPackages } = require('@lerna/filter-options');
const { join, relative } = require('path');

const MODULE_COMPILER_OPTIONS_MAP = {
  cjs: {
    outDir: 'dist/cjs',
    module: 'commonjs',
  },
  esm5: {
    outDir: 'dist/esm5',
    module: 'es2015',
    target: 'es5',
  },
  esm2015: {
    outDir: 'dist/esm2015',
    module: 'es2015',
  },
  types: {
    outDir: 'dist/types',
    declaration: true,
    emitDeclarationOnly: true,
  },
};

(async () => {
  const cwd = join(__dirname, '..');
  const project = new Project(cwd);
  const packages = await project.getPackages();
  const packageGraph = new PackageGraph(packages);
  const filteredPackages = await getFilteredPackages(
    packageGraph,
    { cwd },
    { ignore: ['@jovotech/e2e', '@jovotech/examples-*'] },
  );

  const compilerOptionModuleKeys = Object.keys(MODULE_COMPILER_OPTIONS_MAP);

  const promises = [];
  for (const pkg of filteredPackages) {
    const relativePathToRoot = relative(pkg.location, cwd);
    const relativePathToBuildTsConfig = join(relativePathToRoot, 'tsconfig.build.json');
    const normalizedRelativePathToBuildTsConfig = relativePathToBuildTsConfig.replace(/\\/g, '/');

    const writePromises = compilerOptionModuleKeys.map((key) => {
      const compilerOptions = { ...MODULE_COMPILER_OPTIONS_MAP[key] };
      // disable strict property initialization for output packages
      if (pkg.name.startsWith('@jovotech/output')) {
        compilerOptions.strictPropertyInitialization = false;
      }
      const tsconfig = {
        extends: normalizedRelativePathToBuildTsConfig,
        compilerOptions,
        include: ['src'],
      };
      const tsconfigBuffer = Buffer.from(JSON.stringify(tsconfig, undefined, 2));
      const tsconfigPath = join(pkg.location, `tsconfig.build.${key}.json`);
      return fs.promises.writeFile(tsconfigPath, tsconfigBuffer);
    });
    promises.push(...writePromises);
  }
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
