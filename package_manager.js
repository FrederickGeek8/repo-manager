const dpkg = require("unipkg");
const fs = require("fs-extra");

// first parse Packages to get the current files
class PackageManager {
  static async add(file) {
    var files = [file];
    await fs
    .readFile("Packages")
    .then(data => {
      // Parse data
      const chunks = data.toString().split("\n\n");
      for (let i = 0; i < chunks.length; i++) {
        let reg = /(Filename: )+(.+)/g;
        const match = reg.exec(chunks[i]);
        // match[2] == filename
        if (match && match[2] && !files.includes(match[2])) {
          files.push(match[2]);
        }
      }
    },{
      // not found, just continue
    });

    return dpkg.scanFiles(files);
  }
}

module.exports = PackageManager;
