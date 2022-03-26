import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';
import { Configuration } from 'webpack';
import path from 'path';

const config: Configuration = {
  mode: 'development',
  entry: './src/index.ts',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.ttf$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [new MonacoWebpackPlugin({ languages: ['typescript'] })],
};

export default [config];
