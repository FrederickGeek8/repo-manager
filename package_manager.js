const dpkg = require("unipkg");
const fs = require("fs-extra");
const compressjs = require("compressjs");

// first parse Packages to get the current files
class PackageManager {
  static async add(file, disable_bzip=false) {
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
    }).catch(err => {
      // do nothing, just continue
    });

    await dpkg.scanFiles(files);

    if (!disable_bzip) {
      const alg = compressjs.Bzip2;
      const data = fs.readFileSync("Packages");
      const compressed = alg.compressFile(data);
      fs.writeFileSync("Packages.bz2", compressed, 'binary');
    }
  }
}

module.exports = PackageManager;
