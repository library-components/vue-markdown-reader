const path = require('path')

exports.alias = { // 配置别名
  "@": path.resolve(__dirname, "../src"),
  "~/packages": path.resolve(__dirname, "../packages")
};