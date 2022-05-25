const { join } = require('path');
const fs = require('fs');

function check(fileName, value, result) {
  const data = readFile(fileName);
  const exc = new RegExp(value);
  if (exc.test(data)) {
    result.push(value);
  }
}

function isDirectory(fileName) {
  if (fs.existsSync(fileName)) return fs.statSync(fileName).isDirectory();
  return false;
}

function isFile(fileName) {
  if (fs.existsSync(fileName)) return fs.statSync(fileName).isFile();
  return false;
}

function readFile(fileName) {
  if (fs.existsSync(fileName)) return fs.readFileSync(fileName, 'utf-8');
  return false;
}

function recursiveReadFile(fileName, value, result) {
  if (!fs.existsSync(fileName)) return;
  if (isFile(fileName)) {
    check(fileName, value, result);
  }
  if (isDirectory(fileName)) {
    const files = fs.readdirSync(fileName);
    files.forEach((val) => {
      const temp = join(fileName, val);
      if (isDirectory(temp)) recursiveReadFile(temp, value, result);
      if (isFile(temp)) check(temp, value, result);
    });
  }
}

module.exports = {
  recursiveReadFile
}