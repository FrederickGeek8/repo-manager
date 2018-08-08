#!/usr/bin/env node

const program = require("commander");
const Settings = require("../src/settings");
const PM = require("../src/package_manager");
const set = new Settings();
program.version("2.0.0");

// Init
program
  .command("init")
  .option("-s, --sign", "Sign Release using GPG")
  .action(cmd => {
    if (cmd.sign) {
      return set
        .edit()
        .then(() => set.save())
        .then(() => Settings.sign());
    }

    return set.edit().then(() => set.save());
  });

// Settings
program
  .command("settings")
  .option("-s, --sign", "Sign Release using GPG")
  .alias("edit")
  .action(cmd => {
    if (cmd.sign) {
      return set
        .load()
        .then(() => set.edit())
        .then(() => set.save())
        .then(() => Settings.sign());
    }

    return set
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

program.command("sign").action(() => {
  return Settings.sign();
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.help();
}
