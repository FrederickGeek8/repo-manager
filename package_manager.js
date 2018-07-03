const dpkg = require("unipkg");
const fs = require("fs-extra");
const compressjs = require("compressjs");

// first parse Packages to get the current files
class PackageManager {
  static async add(file, disable_bzip = false) {
    var pkgData = await PackageManager.resolve();

    var files = [file];
    if (Array.isArray(pkgData)) {
      files = pkgData;
      files.push(file);
    } else {
      var chunks = pkgData.toString().split("\n\n");
      for (let i = 0; i < chunks.length; i++) {
        let reg = /(Filename: )+(.+)/g;
        var match = reg.exec(chunks[i]);
        // match[2] == filename
        if (match && match[2] && !files.includes(match[2])) {
          files.push(match[2]);
        }
      }
    }

    return this.save(files, disable_bzip);
  }

  static async remove(file, disable_bzip = false) {
    var pkgData = await PackageManager.resolve();

    var files = [file];
    if (Array.isArray(pkgData)) {
      files = pkgData;
      files.push(file);
    } else {
      var chunks = pkgData.toString().split("\n\n");
      for (let i = 0; i < chunks.length; i++) {
        let reg = /(Filename: )+(.+)/g;
        var match = reg.exec(chunks[i]);
        // match[2] == filename
        if (match && match[2] && !files.includes(match[2])) {
          files.push(match[2]);
        }
      }
    }

    var idx = files.indexOf(file);
    if (idx > -1) {
      files.splice(idx, 1);
    } else {
      throw new Error(`File ${file} not found in Packages index.`);
    }

    return this.save(files, disable_bzip);
  }

  static async save(files, disable_bzip = false) {
    await dpkg.scanFiles(files);

    if (!disable_bzip) {
      const alg = compressjs.Bzip2;
      const pkgData = fs.readFileSync("Packages");
      const compressed = alg.compressFile(pkgData);
      fs.writeFileSync("Packages.bz2", compressed, "binary");
      fs.unlink("Packages");
    } else {
      fs.unlink("Packages.bz2").catch(() => {}); // doesn't have to exist
    }

    // cache results async
    const prom = fs
      .mkdirp(".rpo")
      .then(() => fs.writeFile(".rpo/Packages.json", JSON.stringify(files)));

    return prom;
  }

  static async resolve() {
    /*
      Check that either Packages or Packages.bz2 exist (maybe both) and load
      the more recent version
    */
    const pkgCache = (await fs.stat(".rpo/Packages.json").catch(() => {})) || 0;
    const pkg = (await fs.stat("Packages").catch(() => {})) || 0;
    const pkgBz2 = (await fs.stat("Packages.bz2").catch(() => {})) || 0;

    var selected;
    if (pkgCache.mtime > pkg.mtime && pkgCache.mtime > pkgBz2.mtime) {
      selected = ".rpo/Packages.json";
    } else if (pkg.mtime > pkgBz2.mtime && pkg.mtime > pkgCache.mtime) {
      selected = "Packages";
    } else {
      selected = "Packages.bz2";
    }

    var pkgData = "";
    if (selected == "Packages.bz2") {
      await fs
        .readFile("Packages.bz2")
        .then(data => {
          const alg = compressjs.Bzip2;
          const decompressed = alg.decompressFile(data);
          pkgData = Buffer.from(decompressed).toString();
        })
        .catch(err => {});
    } else if (selected == "Packages") {
      await fs
        .readFile("Packages")
        .then(data => {
          // Parse data
          pkgData = data;
        })
        .catch(err => {
          // do nothing, just continue
        });
    } else {
      await fs
        .readFile(".rpo/Packages.json")
        .then(data => {
          pkgData = JSON.parse(data);
        })
        .catch(err => {});
    }

    return pkgData;
  }
}

module.exports = PackageManager;
