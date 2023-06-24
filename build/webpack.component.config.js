// 按需引入的打包配置文件
"use strict";

const path = require("path");
const os = require("os");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HappyPack = require("happypack");
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

// 按需引入的核心工具方法
const { getComponentEntries } = require('./utils');
const config = require("./config")

module.exports = {
  mode: "production",
  entry: getComponentEntries('packages'), // 按需引入的关键
  output: {
    path: path.resolve(__dirname, "../lib/"),
    publicPath: '/lib/',
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: [".js", ".vue", ".json"], //取消后缀  引入文件路径就不用加文件后缀了
    alias: config.alias
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
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              esModule: false, // 这里设置为false
              limit: 10000,
              name: "images/[name]-[hash:8].[ext]" // 属于file-loader的属性
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              esModule: false, // 这里设置为false
              limit: 10000,
              name: "media/[name].[hash:7].[ext]"
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        options: {
          esModule: false, // 这里设置为false
          limit: 10000, // size <= 5KB
          name: "fonts/[name]-[hash:7].min.[ext]" // 属于file-loader的属性
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[id]-[name].chunk.css'
    }),
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
}