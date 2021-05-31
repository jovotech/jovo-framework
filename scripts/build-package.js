const { promises } = require('fs');
const { join } = require('path');
const { promisify } = require('util');
const { cwd } = require('process');
const exec = promisify(require('child_process').exec);

var chalk;
try {
  chalk = require('chalk');
} catch (e) {
  // polyfill chalk if it could not be loaded
  chalk = {
    cyan(t) {
      return t;
    },
    cyanBright(t) {
      return t;
    },
    blue(t) {
      return t;
    },
    green(t) {
      return t;
    },
    red(t) {
      return t;
    },
    redBright(t) {
      return t;
    },
    gray(t) {
      return t;
    },
  };
}

// hook into log and error to print prefix
const LOG_PROTOTYPE = console.log;
console.log = function (...data) {
  data.unshift(chalk.blue('[Jovo-Build]'));
  LOG_PROTOTYPE.apply(this, data);
};
const ERROR_PROTOTYPE = console.error;
console.error = function (...data) {
  data.unshift(chalk.blue('[Jovo-Build]'));
  ERROR_PROTOTYPE.apply(this, data);
};

const ALLOWED_MODULES = ['cjs', 'esm5', 'esm2015', 'types'];
const MODULE_COMPILER_OPTIONS_MAP = {
  cjs: {
    module: 'commonjs',
    declaration: false,
    outDir: 'dist/cjs',
  },
  esm5: {
    module: 'es2015',
    target: 'es5',
    declaration: false,
    outDir: 'dist/esm5',
  },
  esm2015: {
    module: 'es2015',
    declaration: false,
    outDir: 'dist/esm2015',
  },
  types: {
    declaration: true,
    emitDeclarationOnly: true,
    outDir: 'dist/types',
  },
};

(async () => {
  const modules = ALLOWED_MODULES.slice();
  // console.log(
  //   chalk.cyan(
  //     `Building with modules: ${modules
  //       .map((module) => chalk.cyanBright(module))
  //       .join(', ')} and ${chalk.cyanBright('types')}`,
  //   ),
  // );
  const compilerOptionsList = modules.map((module) => MODULE_COMPILER_OPTIONS_MAP[module]);

  // for (const compilerOptions of compilerOptionsList) {
  //   const stringifiedCompilerOptions = Object.keys(compilerOptions).reduce((accumulator, key) => {
  //     const stringToAdd = `--${key} ${compilerOptions[key]}`;
  //     return `${accumulator} ${stringToAdd}`;
  //   }, '');
  //   await exec(`tsc ${stringifiedCompilerOptions}`, {});
  // }

  const tscExecPromises = compilerOptionsList.map((compilerOptions) => {
    const stringifiedCompilerOptions = Object.keys(compilerOptions).reduce((accumulator, key) => {
      const stringToAdd = `--${key} ${compilerOptions[key]}`;
      return `${accumulator} ${stringToAdd}`;
    }, '');
    return exec(`tsc ${stringifiedCompilerOptions}`, {});
  });
  return Promise.all(tscExecPromises);
})()
  .then(() => {
    console.log(chalk.green('Build succeeded!'));
    process.exit(0);
  })
  .catch((e) => {
    console.error(chalk.redBright('Build failed!'));
    console.error(chalk.red((e.stdout || e.message).trim()));
    console.error(chalk.gray(e.stack));
    process.exit(1);
  });
