const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const mode = process.env.NODE_ENV || 'development';

module.exports = {
  mode,
  devServer: {
    historyApiFallback: true,
    // inline: true,
    port: 3000,
    hot: true,
    // publicPath: '/',
  },
  entry: {
    app: path.join(__dirname,  'index.tsx'),
  },

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: ['babel-loader', 'ts-loader', 'source-map-loader'],
      },
      {
        test: /(\.scss|\.sass)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      },
      // {
      //   test: [/\.js$/, /\.ts?$/, /\.jsx?$/, /\.tsx?$/],
      //   enforce: 'pre',
      //   exclude: /node_modules/,
      //   use: ['source-map-loader']
      // },
    ],
  },

	output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.js',
    sourceMapFilename: '[name].js.map',
  },
  devtool: 'source-map',

  plugins: [
		new webpack.ProvidePlugin({
      React: 'react',
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: '[name].js.map'
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
};