const path = require('path');
const glob = require('glob');
const fs = require('fs');
const webpack = require('webpack');
require('dotenv').config();
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const SRC_DIR = path.resolve(__dirname, 'src');
const OUT_DIR = path.resolve(__dirname, 'dist');

// Create entries for every JS/TS/CSS/SCSS file under src
// Entry key is the path relative to src without extension, so structure is preserved.
function buildEntries() {
  const patterns = ['**/*.{js,jsx,ts,tsx,css,scss}'];
  const files = glob.sync(patterns.join('|'), { cwd: SRC_DIR, nodir: true });
  const entries = {};
  entries['shared'] = path.resolve(SRC_DIR, 'shared.ts');
  files.forEach((relPath) => {
    if (relPath.endsWith('.d.ts')) return;

    const full = path.resolve(SRC_DIR, relPath);
    const key = relPath
      .replace(/\\/g, '/')
      .replace(/\.(js|jsx|ts|tsx|css|scss)$/, '');
    entries[key] = full;
  });
  return entries;
}

module.exports = (env, argv) => {
  const isProd = argv && argv.mode === 'production';
  const entries = buildEntries();

  return {
    mode: isProd ? 'production' : 'development',
    context: SRC_DIR,
    entry: entries,
    output: {
      path: OUT_DIR,
      filename: '[name].js', // '[name]' contains folder segments from src -> preserves structure
      publicPath: './',
      clean: true,
    },
    devtool: isProd ? false : 'source-map',
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.scss', '.css'],
      modules: [SRC_DIR, 'node_modules'],
    },
    module: {
      rules: [
        // TypeScript / JavaScript
        {
          test: /\.[jt]sx?$/i,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true, // type checking handled by ForkTsCheckerWebpackPlugin
            },
          },
        },

        // SCSS / CSS
        {
          test: /\.s?css$/i,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { sourceMap: !isProd },
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: !isProd },
            },
          ],
        },

        // Static images/icons/fonts referenced from JS/CSS
        {
          test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
          exclude: /\.d\.ts$/,
          type: 'asset/resource',

          generator: {
            // Preserve original src folder structure in emitted assets
            filename: '[path][name][ext]',
          },
        },
        {
          test: /\.(woff2?|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: { filename: '[path][name][ext]' },
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        __WEATHER_API__: JSON.stringify(process.env.WEATHER_API),
      }),

      new MiniCssExtractPlugin({
        filename: '[name].css', // keeps same folder structure for CSS
      }),

      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src/home.html'),
        chunks: ['main', 'home'],
        templateParameters: {
          folders: fs
            .readdirSync(path.resolve(__dirname, 'src'), {
              withFileTypes: true,
            })
            .filter((dirent) => dirent.isDirectory() && dirent.name !== 'home')
            .map((dirent) => dirent.name),
        },
      }),

      // Copy HTML and any remaining static files from src -> dist preserving folder structure
      new CopyWebpackPlugin({
        patterns: [
          {
            from: '**/*.html',
            context: SRC_DIR,
            to: OUT_DIR,
            noErrorOnMissing: true,
            globOptions: { dot: true },
          },
          {
            // other static files (images/fonts/etc) that weren't captured by asset/resource or you want copied as-is
            from: '**/*.{png,jpg,jpeg,gif,svg,webp,ico,woff,woff2,ttf,eot,otf,json,txt,xml}',
            context: SRC_DIR,
            to: OUT_DIR,
            noErrorOnMissing: true,
            globOptions: { dot: true },
          },
        ],
      }),

      // Fast type checking in separate process (recommended for ts-loader transpileOnly)
      new ForkTsCheckerWebpackPlugin({
        async: !isProd,
        typescript: {
          configFile: path.resolve(__dirname, 'tsconfig.json'),
        },
      }),
    ],

    // Dev server for development (serves files from dist)
    devServer: {
      static: {
        directory: OUT_DIR,
      },
      compress: true,
      port: 8080,
      hot: true,
      devMiddleware: {
        writeToDisk: true, // write compiled files to dist so output folder matches
      },
    },

    optimization: {
      // no code splitting by default to keep file locations predictable
      splitChunks: false,
      runtimeChunk: false,
    },
  };
};
