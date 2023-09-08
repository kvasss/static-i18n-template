const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const locales = ['ru', 'en'];
const defaultLocale = 'ru';
const environment = require('./configuration/environment');
const pagesSrc = fs.readdirSync(environment.paths.source);

const pages = pagesSrc.filter((file) => ['.html'].includes(path.extname(file).toLowerCase())).map((filename) => 
  filename.replace(/\.html$/, '')
);

const pagesConfig = pages.reduce((config, page) => {
  config[page] = path.resolve(environment.paths.source, 'js', `${page}.js`);
  return config;
}, {});

const wpPages = locales.map( (locale) => {
  if (locale !== defaultLocale) {
    return pages.map( (page) => {
      return new HTMLWebpackPlugin({
        inject: false,
        template: `i18n/${locale}/${page}.html`,
        filename: `${locale}/${page}.html`,
        chunks: [page],
      });
    });
  } else {
    return pages.map( (page) => {
      return new HTMLWebpackPlugin({
        inject: false,
        template: `i18n/${page}.html`,
        filename: `${page}.html`,
        chunks: [page],
      });
    });
  }
});

module.exports = {
  entry: {
    ...pagesConfig
  },

  output: {
    filename: "[name].js",
    path: environment.paths.output,
  },

  module: {
    rules: [
      {
        test: /\.((c|sa|sc)ss)$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      // {
      //   test: /\.(png|gif|jpe?g|svg)$/i,
      //   type: 'asset',
      //   parser: {
      //     dataUrlCondition: {
      //       maxSize: environment.limits.images,
      //     },
      //   },
      //   generator: {
      //     filename: 'img/design/[name][ext]',
      //   },
      // },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: environment.limits.images,
          },
        },
        generator: {
          filename: 'img/design/[name][ext]',
        },
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
    minimizer: [
      '...',
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
              // ['svgo',
              //   {
              //     plugins: [
              //       {
              //         name: 'preset-default',
              //         params: {},
              //       },
              //     ],
              // }],
            ],
          },
        },
      }),
    ],
  },
  plugins: [].concat(
    
    wpPages.flat(1), 
    // pages.map( (page) => {
    //   return new HTMLWebpackPlugin({
    //     template: `src/${page}.html`,
    //     inject: false,
    //     filename: `${page}.html`,
    //     chunks: [page],
    //   });
    // }),
    
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),

    new CleanWebpackPlugin({
      verbose: true,
      // dry: false,
      cleanOnceBeforeBuildPatterns: ['**/*', '!stats.json'],
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(environment.paths.source, 'img'),
          to: path.resolve(environment.paths.output, 'img'),
          toType: 'dir',
          globOptions: {
            ignore: ['*.DS_Store', 'Thumbs.db'],
          },
        },
      ],
    }),
  ),
};
