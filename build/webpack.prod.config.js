// 生成组件库的配置文件
const path = require("path");
const os = require("os");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // css代码分割与提炼
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin') // css代码压缩
const TerserWebpackPlugin = require('terser-webpack-plugin') // 压缩JS
const HappyPack = require("happypack");
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin') // 打包进度条

const config = require("./config")

const prodConfig = {
  mode: 'production',
  entry: {
    app: ['./packages/index.js']
  },
  output: {
    path: path.resolve(__dirname, "../lib"),
    filename: "index.js",
    publicPath: "./",
    library: "vue-markdown-reader",
    libraryTarget: "umd",
    umdNamedDefine: true,
    globalObject: 'typeof self !== \'undefined\' ? self : this'
  },
  resolve: {
    extensions: [".js", ".vue", ".json"], //取消后缀  引入文件路径就不用加文件后缀了
    alias: config.alias
  },
  optimization: {
    minimizer: [
      //压缩css
      new OptimizeCssAssetsWebpackPlugin({}),
      // 压缩JS
      new TerserWebpackPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
    ],
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
        test: /\.(c|sc)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          }
        ],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name]-[hash:7].css',
      chunkFilename: 'css/[id]-[hash:7].chunk.css',
    }),
    new SimpleProgressWebpackPlugin(),
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
  ],
}

module.exports = prodConfig