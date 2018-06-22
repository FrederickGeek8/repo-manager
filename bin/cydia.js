#!/usr/bin/env node

const program = require("commander");
const Settings = require("../settings");
const PM = require("../package_manager");
const set = new Settings();
program.version("2.0.0");

// Init
program.command("init").action(() => {
  set.edit().then(() => set.save());
});

// Settings
program
  .command("settings")
  // .command('prefs')
  .action(() => {
    set
      .load()
      .then(() => set.edit())
      .then(() => set.save());
  });

// Add program
program
  .command("add <file>")
  .option("-d, --disable-bzip", "Disable Bzip2 for Packages")
  .action((file, cmd) => {
    return PM.add(file, cmd.disableBzip);
  });

// Remove program
program
  .command("remove <file>")
  .option("-d, --disable-bzip", "Disable Bzip2 for Packages")
  .action((file, cmd) => {
    return PM.remove(file, cmd.disableBzip);
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.help();
}
