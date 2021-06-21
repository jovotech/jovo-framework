const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const rimraf = require('rimraf');

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

function convertCompilerOptionsToCommandProcess(compilerOptions) {
  const stringifiedCompilerOptions = Object.keys(compilerOptions).reduce((accumulator, key) => {
    const stringToAdd = `--${key} ${compilerOptions[key]}`;
    return `${accumulator} ${stringToAdd}`;
  }, '');
  return exec(`tsc ${stringifiedCompilerOptions}`, {});
}

function asyncRimraf(path, options = {}) {
  return new Promise((resolve, reject) => {
    rimraf(path, options, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

(async () => {
  // console.log(
  //   chalk.cyan(
  //     `Building with modules: ${modules
  //       .map((module) => chalk.cyanBright(module))
  //       .join(', ')} and ${chalk.cyanBright('types')}`,
  //   ),
  // );

  await asyncRimraf('dist');

  const isParallelExecution = !process.argv.includes('--consecutive');

  const compilerOptionsList = Object.values(MODULE_COMPILER_OPTIONS_MAP);
  if (isParallelExecution) {
    const tscExecPromises = compilerOptionsList.map(convertCompilerOptionsToCommandProcess);
    return Promise.all(tscExecPromises);
  } else {
    for (const compilerOptions of compilerOptionsList) {
      await convertCompilerOptionsToCommandProcess(compilerOptions);
    }
  }
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
