// Configuración de Karma + Jasmine + Webpack para pruebas unitarias.
// (sigue la estructura de la guía "Pruebas unitarias con React":
//  specs en src/test, setupTests.js con matchers de @testing-library/jasmine-dom,
//  babel.config.cjs para transpilar JSX y cobertura con karma-coverage)

const fs = require('fs');

// Navegador headless: Chrome si existe, si no Edge (Chromium).
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
    basePath: '',
    frameworks: ['jasmine'],

    files: [
      'src/test/setupTests.js',
      'src/test/**/*.spec.jsx',
    ],
    preprocessors: {
      'src/test/setupTests.js': ['webpack'],
      'src/test/**/*.spec.jsx': ['webpack', 'coverage'],
    },

    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      module: {
        rules: [
          // JSX/JS se transpilan con babel.config.cjs (en la raíz del proyecto)
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
            },
          },
          // El setup importa Bootstrap CSS (style-loader + css-loader)
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

    reporters: ['spec', 'kjhtml', 'coverage'],
    specReporter: {
      suppressSkipped: true,
      showSpecTiming: false,
    },
    coverageReporter: {
      type: 'html',
      dir: 'coverage/',
    },

    plugins: [
      'karma-jasmine',
      'karma-webpack',
      'karma-chrome-launcher',
      'karma-jasmine-html-reporter',
      'karma-coverage',
      'karma-spec-reporter',
    ],

    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        // viewport de escritorio (1440x1000) para que las media queries
        // de Bootstrap se comporten como en un navegador real
        flags: [
          '--no-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--window-size=1440,1000',
        ],
      },
    },

    singleRun: false,
    restartOnFileChange: false,
    concurrency: 1,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
  });
};
