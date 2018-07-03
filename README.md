# rpo
[![npm](https://img.shields.io/npm/v/rpo.svg)](https://www.npmjs.com/package/rpo)

A sweet, simple, multi-platform Debian/Cydia repository manager. Currently a CLI
tool, but a web and desktop interface are planned for future releases.

The purpose of this is to create a tool that can easily manage a Debian or Cydia
repository regardless of platform. Utilizing libraries written entirely in
Javascript, such as [unipkg](https://github.com/FrederickGeek8/unipkg),
`rpo` is able to perform operations such as `dpkg-scanpackages` without `dpkg` ever being installed.

# Installing
To install `rpo` globally run
```bash
npm install -g rpo
```

# Usage
For full usage [please visit the wiki.](https://github.com/FrederickGeek8/repo-manager/wiki)
Usage for the `rpo` can be found by doing `rpo <subcommand> --help`. To see 
available subcommands, you can run `rpo` or `rpo --help`. Example:
```bash
> rpo -h

  Usage: rpo [options] [command]

  Options:

    -V, --version            output the version number
    -h, --help               output usage information

  Commands:

    init [options]
    settings|edit [options]
    add [options] <file>
    remove [options] <file>
    sign
```
## Description of Subcommands
`rpo init`: Initializes a repository.

`rpo settings`: Edits the settings of a repository

`rpo add`: Adds a package to a repository

`rpo remove`: Removes a package from a repository

`rpo sign`: Signs (if not already) a repository

# Prerequisites
All that is assumed that you are running a Node.js version that
[has not been marked as end-of-life.](https://github.com/nodejs/Release#release-schedule)

# Roadmap
*Progress can be tracked over on the [project board.](https://github.com/FrederickGeek8/repo-manager/projects)*
1. Create a desktop interface similar in effect to Github Desktop, where locations
of repositories are kept track of and can be managed easily through a GUI.
2. Create a backend interface similar to that of the previous version of `repo-manager`
(for those of you who remember it), where the repository can be managed remotely.
3. Create an automated frontend generation system that will updated and present
to users what packages are currently in the repository.