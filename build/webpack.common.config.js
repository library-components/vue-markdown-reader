// webpack基础配置文件
const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HappyPack = require("happypack");
const os = require("os");
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

const config = require("./config")

module.exports = {
  mode: "production",
  entry: {
    app: ['./packages/index.js']
  },
  output: {
    path: path.resolve(__dirname, "../lib"),
    publicPath: './',
    filename: 'vue-markdown-reader.common.js',
    libraryExport: 'default',
    library: 'library',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: [".js", ".vue", ".json"], //取消后缀  引入文件路径就不用加文件后缀了
    alias: config.alias
  },
  optimization: {
    minimize: false // 不压缩js
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        //把对.js 的文件处理交给id为happyBabel 的HappyPack 的实例执行
        loader: "happypack/loader?id=happyBabel",
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        use: ["vue-loader"]
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: "vue-loader",
            options: {
              compilerOptions: {
                preserveWhitespace: false
              }
            }
          },
          {
            loader: path.resolve(__dirname, "./md-loader/index.js")
          }
        ]
      },
      {
        test: /\.(c|sc)ss$/,
        use: [
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          }
        ],
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HappyPack({
      //用id来标识 happypack处理那里类文件
      id: "happyBabel",
      //如何处理  用法和loader 的配置一样
      loaders: [
        {
          loader: "babel-loader?cacheDirectory=true"
        }
      ],
      //共享进程池
      threadPool: happyThreadPool,
      //允许 HappyPack 输出日志
      verbose: true,
      threads: 4 // 线程开启数
    })
  ]
};