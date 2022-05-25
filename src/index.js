const fs = require('fs');
const { resolve } = require('path');
const process = require('process');
const { recursiveReadFile } = require('./utils');

const DEFAULT_PATH = './dist/index.js';
const path = resolve(process.cwd(), DEFAULT_PATH);
const SOURCE_CODE_PATH = resolve(process.cwd(), './src');


function getUnUsedNames() {
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    // eg: /* unused harmony exports RUNTIME_ENV, MAX_PENDING_TIME */
    const matchStrings = data.match(/\/\* unused harmony exports.+\*\//g);

    // # sourceURL=webpack://fe-ec-user/./node_modules/dva/dist/index.esm.js?
    if (!matchStrings) {
      console.log('未找到需要tree shaking的变量');
    }

    let unUsedNames = [];
    matchStrings.forEach((item) => {
      unUsedNames = unUsedNames.concat(
        item
          .split('exports')[1]
          .split('*/')[0]
          .split(',')
          .map((name) => name.trim()),
      );
    });
    const result = [];
    unUsedNames.forEach((name) => {
      recursiveReadFile(SOURCE_CODE_PATH, name, result);
    });
    const message = `未使用的方法,变量名有:${Array.from(new Set(result)).join(',')}`;
    console.log('\x1B[31m%s\x1B[0m', message);
  });
}

getUnUsedNames();
