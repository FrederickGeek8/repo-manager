const fs = require("fs-extra");
const readline = require("readline");
const inquirer = require("inquirer");
const openpgp = require("openpgp");
const os = require("os");

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
    fs.stat("Release")
      .then(async stats => {
        const rl = readline.createInterface({
          input: fs.createReadStream("Release")
        });

        rl.on("line", line => {
          let splitted = line.split(/:(.+)/);
          if (splitted[0] in this.settings) {
            this.settings[splitted[0]] = splitted[1].trim();
          }
        });

        await new Promise((res, rej) => {
          rl.on("close", () => res());
        });
      })
      .catch(err => {
        return fs.open("Release", "w").then(fd => fd.close());
      });
  }

  async save() {
    const saving = fs.createWriteStream("Release");

    for (let key in this.settings) {
      let line = `${key}: ${this.settings[key]}\n`;
      await new Promise((res, rej) => {
        saving.write(line, () => res());
      });
    }

    // saving.on("finish", () => sign());

    saving.end();
  }

  static async sign() {
    var homeDir = `${os.homedir()}/.cydia`;
    var pubkey;
    var privkey;
    var passphrase;
    await fs
      .readFile(`${homeDir}/pubkey.key`)
      .then(data => {
        pubkey = data.toString();
        return fs.readFile(`${homeDir}/privkey.key`);
      })
      .then(data => {
        privkey = data.toString();
      })
      .catch(err => {
        // create key pair
        const questions = [
          {
            name: "Name",
            default: "Real Name"
          },
          {
            name: "Email Address",
            default: "test@nerd.net"
          },
          {
            name: "Passphrase",
            type: "password"
          }
        ];

        return inquirer
          .prompt(questions)
          .then(answers => {
            const options = {
              userIds: [
                { name: answers["Name"], email: answers["Email Address"] }
              ],
              numBits: 4096,
              passphrase: answers["Passphrase"]
            };

            return openpgp.generateKey(options);
          })
          .then(key => {
            privkey = key.privateKeyArmored;
            pubkey = key.publicKeyArmored;
          })
          .then(_ => fs.mkdirp(homeDir))
          .then(_ => fs.writeFile(`${homeDir}/pubkey.key`, pubkey))
          .then(_ => fs.writeFile(`${homeDir}/privkey.key`, privkey));
      });

    const privKeyObj = openpgp.key.readArmored(privkey).keys[0];
    const questions = [
      {
        name: "Passphrase",
        type: "password"
      }
    ];

    await inquirer
      .prompt(questions)
      .then(answers => privKeyObj.decrypt(answers["Passphrase"]));

    const options = {
      data: fs.readFileSync("Release"),
      privateKeys: [privKeyObj],
      detached: true
    };

    return openpgp.sign(options).then(signed => {
      const detachedSig = signed.signature;
      return fs.writeFile("Release.gpg", detachedSig);
    });
  }
}

module.exports = Settings;
