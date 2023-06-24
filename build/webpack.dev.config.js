// 开发环境的配置文件
const path = require('path')
const os = require("os");
const webpack = require('webpack')
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const htmlWebpackPlugin = require("html-webpack-plugin");
const HappyPack = require("happypack");
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

const config = require("./config")

const devConfig = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: path.resolve(__dirname, "../src/main.js"),
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    compress: true, // 是否压缩
    open: true, //自动打开浏览器
    host: 'localhost',
    port: 9099,
    hot: true, //启用webpack的热模块替换功能
    historyApiFallback: true, // 不跳转
    inline: true, // 实时刷新,
    overlay: {
      warning: true,
      errors: true,
    },
    publicPath: '/',
    //hotOnly: true
    //devServer.hot在没有页面刷新的情况下启用热模块替换作为构建失败时的后备
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
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: { sourceMap: true },
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
              name: "static/[name]-[hash:8].[ext]" // 属于file-loader的属性
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
              name: "static/[name].[hash:7].[ext]"
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
          name: "static/[name]-[hash:7].min.[ext]" // 属于file-loader的属性
        }
      }
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new htmlWebpackPlugin({
      // 可以指定文件当模板  让这个文件为入口  读取模板的入口文件
      template: path.resolve(__dirname, "../index.html"),
      // 输出的模板文件，名为index.html, 在dist目录下
      filename: "index.html"
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
  ],
}

module.exports = devConfig