[![Release](https://github.com/nabondance/afthonia/actions/workflows/release.yml/badge.svg)](https://github.com/nabondance/afthonia/actions/workflows/release.yml)


# afthonía
[αφθονία](https://en.wiktionary.org/wiki/%CE%B1%CF%86%CE%B8%CE%BF%CE%BD%CE%AF%CE%B1)

# What is it ?
I was tired of making custom scripts for myself and wanted to share useful tools to anyone interested.
The afthonía sfdx plugin propose a set of tools for people working with salesforce: developers, admins, product manager, etc. .

Intuitive VS Code interfaces will be also provided.

# How to install the plugin
## Install as plugin

Install plugin: `sfdx plugins install afthonia`

## Install from source
Install the [SFDX CLI](https://developer.salesforce.com/tools/sfdxcli)

Clone the repository: `git clone https://github.com/nabondance/afthonia.git`

Install npm modules: `npm install`

Link the plugin: `sfdx plugins:link .`

## Install in your npm package

Install via npm: `npm install afthonia`

# Main Dependencies
- Salesforce/core
- Salesforce/sf-plugins-core

# How to use it

## TestSuite
Create a test suite with all the tests classes from a specific folder.

`sfdx afthonia testSuite create -p <path/to/folder>`

# Future feature ideas
Stay tuned 😉
