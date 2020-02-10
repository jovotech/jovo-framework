# jovo convert

Learn more about how to convert your i18n model to csv and vice versa to quickly either import your spreadsheet data to an i18n model or import your i18n model to a cms of your choice with the `jovo convert` CLI command.

* [Introduction](#introduction)
* [Workflow](#workflow)

## Introduction

`jovo convert` is the Jovo CLI command to either convert i18n.json-files to .csv-files, or .csv-files to i18n.json-files. This way you can import your i18n-model to a cms of your choice, or convert your cms data to respective local i18n files.

> [Find out more about Jovo's CMS Integrations](https://www.jovo.tech/docs/cms)

## Workflow

The `jovo convert` command is followed by the function type you want to run depending on your use case, `i18nToCsv` or `csvToI18n`. You have to set the path of your originating files with the `--from <originPath>` option. You can choose between setting an entire folder (for `jovo convert i18nToCsv`) or just a single file (for `jovo convert csvToI18n` and `jovo convert i18nToCsv`).

```sh
# Default
$ jovo convert i18nToCsv|csvToI18n --from <originPath>

# Options
$ jovo convert i18nToCsv|csvToI18n --from <originPath> [--to <targetPath>] 
```

The respective output files will be created either in your directory of choice, which you can optionally set with `--to <targetPath>` or in your root project folder, either in a `i18n/` folder or as a `responses.csv` file.

<!--[metadata]: {"description": "Learn more about how to convert your i18n model to csv and vice versa to quickly either import your spreadsheet data to an i18n model or import your i18n model to a cms of your choice with the `jovo convert` CLI command.",
                "route": "cli/convert"}-->
