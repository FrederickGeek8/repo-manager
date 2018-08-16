const dpkg = require("unipkg");
const fs = require("fs-extra");
const compressjs = require("compressjs");
const path = require("path");

// first parse Packages to get the current files
class PackageManager {
  static async add(file, disable_bzip = false, pathPrefix = "./") {
    var pkgData = await PackageManager.resolve(pathPrefix);

    var files = [file];
    if (Array.isArray(pkgData)) {
      files = pkgData.map(x => path.join(pathPrefix, x));
      files.push(file);
    } else {
      var chunks = pkgData.toString().split("\n\n");
      for (let i = 0; i < chunks.length; i++) {
        let reg = /(Filename: )+(.+)/g;
        var match = reg.exec(chunks[i]);
        // match[2] == filename
        if (match && match[2] && !files.includes(match[2])) {
          files.push(path.join(pathPrefix, match[2]));
        }
      }
    }

    return this.save(files, disable_bzip, pathPrefix);
  }

  static async remove(file, disable_bzip = false, pathPrefix = "./") {
    var pkgData = await PackageManager.resolve(pathPrefix);

    var files = [];
    if (Array.isArray(pkgData)) {
      files = pkgData.map(x => path.join(pathPrefix, x));
    } else {
      var chunks = pkgData.toString().split("\n\n");
      for (let i = 0; i < chunks.length; i++) {
        let reg = /(Filename: )+(.+)/g;
        var match = reg.exec(chunks[i]);
        // match[2] == filename
        if (match && match[2] && !files.includes(match[2])) {
          files.push(path.join(pathPrefix, match[2]));
        }
      }
    }

    var idx = files.indexOf(file);
    if (idx > -1) {
      files.splice(idx, 1);
    } else {
      throw new Error(`File ${file} not found in Packages index.`);
    }

    return this.save(files, disable_bzip, pathPrefix);
  }

  static async list(pathPrefix = "./") {
    var pkgData;
    await PackageManager.resolve(pathPrefix, false).then(data => {
      pkgData = data;
    });

    // first split then parseControl
    var chunks = pkgData.toString().split("\n\n");
    const pkgs = [];
    for (let i = 0; i < chunks.length - 1; i++) {
      let dataDict = {
        Package: "",
        Version: "",
        Architecture: "",
        Maintainer: "",
        Description: []
      };

      /*
        We use this less than ideal regex here to deal with long
        descriptions that are present in some Debian packages.
        
        https://www.debian.org/doc/manuals/maint-guide/dreq.en.html#control
      */

      var result;
      var reg = /^(([^\s]*):)?(.+)/gm;
      while ((result = reg.exec(chunks[i]))) {
        /*
          result[1] = Description:
          result[2] = Description
          result[3] = virtual dice roller
        */

        if (result[3]) {
          if (!result[2] || result[2] == "Description") {
            dataDict["Description"].push(result[3].trim());
          } else {
            dataDict[result[2]] = result[3].trim();
          }
        }
      }

      pkgs.push(dataDict);
    }

    return pkgs;
  }

  static async save(files, disable_bzip = false, pathPrefix = "./") {
    await dpkg.scanFiles(files, pathPrefix);

    if (!disable_bzip) {
      const alg = compressjs.Bzip2;
      const pkgData = fs.readFileSync(path.join(pathPrefix, "Packages"));
      const compressed = alg.compressFile(pkgData);
      fs.writeFileSync(
        path.join(pathPrefix, "Packages.bz2"),
        compressed,
        "binary"
      );
      fs.unlink(path.join(pathPrefix, "Packages"));
    } else {
      fs.unlink(path.join(pathPrefix, "Packages.bz2")).catch(() => {}); // doesn't have to exist
    }

    // cache results async
    const prom = fs
      .mkdirp(path.join(pathPrefix, ".rpo"))
      .then(() =>
        fs.writeFile(
          path.join(pathPrefix, ".rpo", "Packages.json"),
          JSON.stringify(files)
        )
      );

    return prom;
  }

  static async resolve(pathPrefix = "./", enableCache = true) {
    /*
      Check that either Packages or Packages.bz2 exist (maybe both) and load
      the more recent version
    */
    const pkgCache =
      (await fs
        .stat(path.join(pathPrefix, ".rpo", "Packages.json"))
        .then(_ => _.mtime)
        .catch(() => {})) || 0;
    const pkg =
      (await fs
        .stat(path.join(pathPrefix, "Packages"))
        .then(_ => _.mtime)
        .catch(() => {})) || 0;
    const pkgBz2 =
      (await fs
        .stat(path.join(pathPrefix, "Packages.bz2"))
        .then(_ => _.mtime)
        .catch(() => {})) || 0;

    var selected;
    if (pkgCache > pkg && pkgCache > pkgBz2 && enableCache) {
      selected = path.join(pathPrefix, ".rpo", "Packages.json");
    } else if (pkg > pkgBz2 && (pkg > pkgCache || !enableCache)) {
      selected = path.join(pathPrefix, "Packages");
    } else {
      selected = path.join(pathPrefix, "Packages.bz2");
    }

    var pkgData = "";
    if (selected == path.join(pathPrefix, "Packages.bz2")) {
      await fs
        .readFile(path.join(pathPrefix, "Packages.bz2"))
        .then(data => {
          const alg = compressjs.Bzip2;
          const decompressed = alg.decompressFile(data);
          pkgData = Buffer.from(decompressed).toString();
        })
        .catch(err => {});
    } else if (selected == path.join(pathPrefix, "Packages")) {
      await fs
        .readFile(path.join(pathPrefix, "Packages"))
        .then(data => {
          // Parse data
          pkgData = data;
        })
        .catch(err => {
          // do nothing, just continue
        });
    } else {
      await fs
        .readFile(path.join(pathPrefix, ".rpo", "Packages.json"))
        .then(data => {
          pkgData = JSON.parse(data);
        })
        .catch(err => {});
    }

    return pkgData;
  }
}

module.exports = PackageManager;
