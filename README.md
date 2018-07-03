# rpo
[![npm](https://img.shields.io/npm/v/rpo.svg)](https://www.npmjs.com/package/rpo)

A sweet, simple, multi-platform Debian/Cydia repository manager.

The purpose of this is to create a tool that can easily manage a Debian or Cydia
repository regardless of platform. Utilizing libraries written entirely in
Javascript, such as [unipkg](https://github.com/FrederickGeek8/unipkg),
`rpo` is able to perform operations such as `dpkg` without `dpkg` ever being installed.

# Installing
To install `rpo` globally run
```bash
npm install -g rpo
```

# Prerequisites
All that is assumed that you are running a Node.js version that
[has not been marked as end-of-life.](https://github.com/nodejs/Release#release-schedule)
