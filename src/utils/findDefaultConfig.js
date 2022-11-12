const fs = require('fs');
const path = require('path');
const process = require('process');

function findFirstExistFile(files) {
  if (!files || !files.length) return undefined;

  return files.find(function(file) {
    try {
      fs.accessSync(file, fs.constants.R_OK);
      return file;
    } catch (err) {
      return false;
    }
  });
}

function findDefaultConfig() {
  const baseFile = './base.json';
  const configFile = './config.json';
  const files = [
    path.resolve(process.cwd(), baseFile),
    path.resolve(__dirname, '..', baseFile),
    path.resolve(process.cwd(), configFile),
    path.resolve(__dirname, '..', configFile),
  ];
  return findFirstExistFile(files);
}

module.exports = findDefaultConfig;
