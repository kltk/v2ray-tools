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
  const configPath = './base.json';
  const files = [
    path.resolve(process.cwd(), configPath),
    path.resolve(__dirname, '..', configPath),
  ];
  return findFirstExistFile(files);
}

module.exports = findDefaultConfig;
