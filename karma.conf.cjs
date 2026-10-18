const fs = require('fs');

const candidatos = [
  process.env.CHROME_BIN,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
].filter(Boolean);

const CHROME_BIN = candidatos.find((ruta) => {
  try {
    return fs.existsSync(ruta);
  } catch {
    return false;
  }
});

if (CHROME_BIN) {
  process.env.CHROME_BIN = CHROME_BIN;
}

module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      'src/test/setupTests.js',
      'src/test/**/*.spec.jsx',
    ],
    preprocessors: {
      'src/test/setupTests.js': ['webpack'],
      'src/test/**/*.spec.jsx': ['webpack'],
    },
    webpack: {
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react'],
              },
            },
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
          },
        ],
      },
      resolve: {
        extensions: ['.js', '.jsx'],
      },
    },
    reporters: ['progress', 'kjhtml', 'coverage'],
    coverageReporter: {
      type: 'html',
      dir: 'coverage/',
    },
    browsers: ['ChromeHeadless'],
    singleRun: true,
    restartOnFileChange: true,
    plugins: [
      'karma-jasmine',
      'karma-webpack',
      'karma-chrome-launcher',
      'karma-coverage',
      'karma-jasmine-html-reporter',
    ],
  });
};