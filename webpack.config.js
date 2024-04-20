// Generated using webpack-cli https://github.com/webpack/webpack-cli

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const isProduction = process.env.NODE_ENV == 'production';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {
  entry: './src/start-node-red.js',
  mode: isProduction ? 'production' : 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: 'babel-loader',
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
};

export default config;

// const configObj = () => {
//   if (isProduction) {
//     config.mode = 'production';
//   } else {
//     config.mode = 'development';
//   }
//   return config;
// };

// export default configObj();
