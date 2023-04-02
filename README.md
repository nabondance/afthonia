# sfdx-afthonía
[αφθονία](https://en.wiktionary.org/wiki/%CE%B1%CF%86%CE%B8%CE%BF%CE%BD%CE%AF%CE%B1)

If you understood the name, you can star it 🤩

# What is it ?
I was tired of making custom scripts for myself and wanted to share useful tools to anyone interested.
The afthonía sfdx plugin propose a set of tools for people working with salesforce: developers, admins, product manager, etc. .
Intuitive VS Code interfaces are also provided.

# How to install the plugin
## Install as plugin

Install plugin: `sfdx plugins install sfdx-afthonia`

## Install from source
Install the [SDFX CLI](https://developer.salesforce.com/tools/sfdxcli)

Clone the repository: `git clone https://github.com/nabondance/sfdx-afthonia.git`

Install npm modules: `npm install`

Link the plugin: `sfdx plugins:link .`

# Dependencies
- Salesforce/core
- Salesforce/sf-plugins-core

# How to use it

## TestSuite
Create a test suite with all the tests classes from a specific folder.

`sfdx afthonia testSuite create -p <path/to/folder>`

# Futur feature ideas
Stay tuned 😉