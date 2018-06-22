"use strict";
const dpkg = require("unipkg");
const fs = require("fs-extra");
const compressjs = require("compressjs");

// first parse Packages to get the current files
class PackageManager {
  static async add(file, disable_bzip = false) {
    /*
      Check that either Packages or Packages.bz2 exist (maybe both) and load
      the more recent version
    */
    const pkgCache =
      (await fs.stat(".cydia/Packages.json").catch(() => {})) || 0;
    const pkg = (await fs.stat("Packages").catch(() => {})) || 0;
    const pkgBz2 = (await fs.stat("Packages.bz2").catch(() => {})) || 0;

    var selected;
    if (pkgCache.mtime > pkg.mtime && pkgCache.mtime > pkgBz2.mtime) {
      selected = ".cydia/Packages.json";
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
        .readFile(".cydia/Packages.json")
        .then(data => {
          pkgData = JSON.parse(data);
        })
        .catch(err => {});
    }

    var files = [file];
    if (!Array.isArray(pkgData)) {
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

    // cache results async
    const prom = fs
      .readFile(".cydia/Packages.json")
      .then(data => {
        var cache = JSON.parse(data); // array of files
        for (let i = 0; i < files.length; i++) {
          if (!cache.includes(files[i])) {
            cache.push(files[i]);
          }
        }

        return fs.writeFile(".cydia/Packages.json", JSON.stringify(cache));
      })
      .catch(err => {
        // just write out all files
        return fs
          .mkdirp(".cydia")
          .then(() =>
            fs.writeFile(".cydia/Packages.json", JSON.stringify(files))
          );
      });

    await dpkg.scanFiles(files);

    if (!disable_bzip) {
      const alg = compressjs.Bzip2;
      const pkgData = fs.readFileSync("Packages");
      const compressed = alg.compressFile(pkgData);
      fs.writeFileSync("Packages.bz2", compressed, "binary");
      fs.unlinkSync("Packages");
    }

    return prom;
  }
}

module.exports = PackageManager;
