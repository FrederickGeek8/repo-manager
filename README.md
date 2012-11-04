Repo Manager
============

A sweet, simple, Cydia repo manager.

The purpose of this is too create something that can simple be placed in any web directory (with PHP installed) and allow someone to start a Cydia repo.

Everything is in order so you can clone, fork, or download this. 

This was designed to be run on Ubuntu Server. It should work on all other Linux Systems.

Installing
============

To install this, just place all the file in a directory on your webserver. You must have PHP5 installed. After go to the installation directory in a webbrowser, click 'Repo Settings', and then click 'Update'. Then point your device(s) to http://yourserver.com/repo-directory

Prerequisites
============

In order for this to run you need to have installed two other packages besides PHP and a webserver. You need bzip2 and dpkg-dev. These packages can be installed by running:

sudo apt-get install bzip2 dpkg-dev
