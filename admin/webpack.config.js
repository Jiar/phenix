const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin'); // html
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // css压缩
const ExtendedDefinePlugin = require('extended-define-webpack-plugin'); // 全局变量
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin'); // 压缩插件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); // 多线程压缩
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; //视图分析webpack情况

const HappyPack = require('happypack'); // 多线程运行

const { argv } = process;
let env = 'development'; // 默认是开发模式
argv.forEach(v => {
  if (v === 'production') {
    env = 'production';
  }
});
/**
 * 公共插件
 */
const plugins = [
  new HtmlWebpackPlugin({
    template: `${__dirname}/src/index.html`, // 源html
    favicon: `${__dirname}/src/favicon.ico`,
    inject: 'body', // 注入到哪里
    filename: 'index.html' // 输出后的名称
  }),
  new MiniCssExtractPlugin({ // css添加hash
    filename: 'css/[name].[contenthash:8].css'
  }),
  new HappyPack({ // 多线程运行 默认是电脑核数-1
    id: 'babel', // 对于loaders id
    loaders: ['babel-loader?cacheDirectory'] // 是用babel-loader解析
  })
];
const configDev = {
  plugins: plugins.concat(
    new ExtendedDefinePlugin({ // 全局变量
      __LOCAL__: true
    }),
  )
};
const configPro = {
  plugins: plugins.concat(
    // new UglifyJsPlugin({ sourceMap: true }), //压缩，生成map
    new ExtendedDefinePlugin({ // 全局变量
      'process.env': {
        NODE_ENV: env === 'development' ? "development": "production"
      },
      __LOCAL__: false
    }),
    new ParallelUglifyPlugin({ // 默认启用计算器当前cup-1,运行进程
      cacheDir: '.cache/',
      sourceMap: true,
      uglifyJS: {
        output: {
          beautify: false,
          comments: false // 删除注释,
        },
        compress: {
          warnings: false, // 删除没用的代码不警告
          drop_console: true, // 删除console
          reduce_vars: true // 提取出现多次但是没有定义成变量去引用的静态资源
        }
      }
    }),
    // new BundleAnalyzerPlugin({   //另外一种方式
    //   analyzerMode: 'server',
    //   analyzerHost: '127.0.0.1',
    //   analyzerPort: 8889,
    //   reportFilename: 'report.html',
    //   defaultSizes: 'parsed',
    //   openAnalyzer: true,
    //   generateStatsFile: false,
    //   statsFilename: 'stats.json',
    //   statsOptions: null,
    //   logLevel: 'info',
    // }),
  )

};
const config = env === 'development' ? configDev : configPro;
module.exports = {
  devServer: {
    contentBase: path.join(__dirname, 'dist'), // 开发服务运行时的文件根目录
    compress: true, // 开发服务器是否启动gzip等压缩
    port: 8062, // 端口
    historyApiFallback: true, // 不会出现404页面，避免找不到
    proxy: {
      '/api/*': {
        target: 'http://127.0.0.1:8060/', // server
        changeOrigin: true
      }
    }
  },
  devtool: env === 'development' ? 'cheap-eval-source-map' : 'source-map', // cheap-eval-source-map  是一种比较快捷的map,没有映射列
  performance: {
    maxEntrypointSize: 250000, // 入口文件大小，性能指示
    maxAssetSize: 250000, // 生成的最大文件
    hints: false // 依赖过大是否错误提示
    // assetFilter: function(assetFilename) {
    //   return assetFilename.endsWith('.js');
    // }
  },
  entry: { // 入口
    index: './src/index.js'
  },
  output: { // 出口
    path: path.resolve(__dirname, 'dist'), // 出口路径
    filename: 'js/[name].[hash].js', // 出口文件名称
    chunkFilename: 'js/[name].[hash].js', // 按需加载名称
    publicPath: '/' // 公共路径
  },
  resolve: {
    mainFields: ['jsnext:main', 'browser', 'main'], // npm读取先后方式  jsnext:main 是采用es6模块写法
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  module: {
    noParse: /node_modules\/(moment\.js)/, // 不解析
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/, // 排除
        include: [path.resolve(__dirname, 'src')], // 包括
        // use: ['babel-loader?cacheDirectory'],
        loader: 'happypack/loader?id=babel'
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [path.resolve('src'), path.resolve('test')]
      },

      {
        test: /\.css/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              minimize: true,
              plugins: () => [require('autoprefixer')]
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              minimize: true,
              plugins: () => [require('autoprefixer')]
            }
          },
          'less-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif|jpeg|ttf|svg|eot|woff)$/,
        exclude: /(node_modules|bower_components)/,
        include: [path.resolve(__dirname, 'src')],
        use: [
          {
            loader: 'url-loader?limit=81920', // limit 图片大小的衡量，进行base64处理
            options: {
              name: '[path][name].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: config.plugins,
  optimization: {
    // 打包 第三方库
    // 打包 公共文件
    splitChunks: {
      cacheGroups: {
        vendor: { // node_modules内的依赖库
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          minChunks: 1, // 被不同entry引用次数(import),1次的话没必要提取
          maxInitialRequests: 5,
          minSize: 0,
          priority: 100
          // enforce: true?
        },
        common: { // ‘src/js’ 下的js文件
          chunks: 'all',
          test: /[\\/]src[\\/]js[\\/]/, // 也可以值文件/[\\/]src[\\/]js[\\/].*\.js/,
          name: 'common', // 生成文件名，依据output规则
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0,
          priority: 1
        }
      }
    },
    runtimeChunk: {
      name: 'manifest'
    },
    minimizer: [
      new OptimizeCssAssetsPlugin({}), // 压缩 css,使用minimizer会自动取消webpack的默认配置，所以记得用UglifyJsPlugin
      new UglifyJsPlugin({
        // 压缩 js
        uglifyOptions: {
          ecma: 6,
          cache: true,
          parallel: true
        }
      })
    ]
  }
};
