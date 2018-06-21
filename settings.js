const fs = require("fs");
const readline = require("readline");
const inquirer = require("inquirer");

class Settings {
  constructor() {
    this.settings = {
      Origin: "",
      Label: "",
      Suite: "",
      Version: "",
      Codename: "",
      Architectures: "",
      Components: "",
      Description: ""
    };

    this.defaults = {
      Origin: "Full Repo Name",
      Label: "Repo Name",
      Suite: "stable",
      Version: "1.0",
      Codename: "main",
      Architectures: "iphoneos-arm",
      Components: "main",
      Description: "Short description of repository."
    };
  }

  async edit() {
    const questions = [];

    // Construct questions
    for (let key in this.settings) {
      let def =
        this.settings[key] == "" ? this.defaults[key] : this.settings[key];

      questions.push({
        name: key,
        default: def
      });
    }

    await inquirer.prompt(questions).then(answers => {
      this.settings = answers;
      console.log(this.settings);
    });
  }

  async load() {
    const rl = readline.createInterface({
      input: fs.createReadStream("Release")
    });

    rl.on("line", line => {
      let splitted = line.split(/:(.+)/);
      if (splitted[0] in this.settings) {
        this.settings[splitted[0]] = splitted[1].trim();
      }
    });

    await new Promise((res) => {
      rl.on("close", () => res());
    });
  }

  async save() {
    const saving = fs.createWriteStream("Release");

    for (let key in this.settings) {
      let line = `${key}: ${this.settings[key]}\n`;
      await new Promise((res) => {
        saving.write(line, () => res());
      });
    }

    saving.end();
  }
}

module.exports = Settings;
