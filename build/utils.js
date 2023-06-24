'use strict'
const path = require('path')
const fs = require('fs');

//  获取基于当前路径的目标文件
const resolve = dir => path.join(__dirname, '../', dir);

exports.getComponentEntries = function (relativePath) {
  let files = fs.readdirSync(resolve(relativePath));

  const componentEntries = files.reduce((fileObj, item) => {
    //  文件路径
    const itemPath = path.join(relativePath, item);
    // theme-chalk目录下没有index.js文件，需排除该目录
    const isDir = fs.statSync(itemPath).isDirectory() && itemPath.indexOf('theme-chalk') === -1;
    const [name, suffix] = item.split('.');

    console.log("isDir: ", itemPath)

    //  文件中的入口文件
    if (isDir) {
      fileObj[item] = resolve(path.join(itemPath, 'index.js'));
    }
    //  文件夹外的入口文件
    else if (suffix === 'js') {
      fileObj[name] = resolve(`${itemPath}`);
    }
    return fileObj;
  }, {});

  return componentEntries;
}

