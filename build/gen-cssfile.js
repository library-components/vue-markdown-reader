/**
 * 分离式scss样式合并到lib中，和组件组成完整的组件
 * cp-cli packages/theme-chalk/lib lib/theme-chalk 将编译好的css文件拷贝到lib/theme-chalk中
 * 该文件主要用于生成icon这种不会被编译的scss和那些不存在于theme-chalk的样式文件
 */

var fs = require('fs');
var path = require('path');
var Components = require('../components.json');
var themes = [
  'theme-chalk'
];
Components = Object.keys(Components);
var basepath = path.resolve(__dirname, '../packages/');

function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

// 遍历生成对应的样式文件
themes.forEach((theme) => {
  var isSCSS = theme !== 'theme-default';

  // 由于icon.scss没有对应的组件，所以要在这里单独加上，将其写入index.scss中
  var indexContent = isSCSS ? '@import "./icon.scss";\n' : '@import "./icon.css";\n';

  // 必须在此遍历，以向index.scss中动态写入引用其它组件的样式的语句，创建component.json方便在此动态生成scss文件
  Components.forEach(function(key) {
    if (['icon', 'option', 'option-group'].indexOf(key) > -1) return;
    var fileName = key + (isSCSS ? '.scss' : '.css');
    indexContent += '@import "./' + fileName + '";\n';
    var filePath = path.resolve(basepath, theme, 'src', fileName);

    // 当文件不存在时，创建缺失的scss样式文件
    if (!fileExists(filePath)) {
      fs.writeFileSync(filePath, '', 'utf8');
      console.log(theme, ' 创建遗漏的 ', fileName, ' 文件');
    }
  });

  // 向对应目录写入文件
  fs.writeFileSync(path.resolve(basepath, theme, 'src', isSCSS ? 'index.scss' : 'index.css'), indexContent);
});