// Configuración de Babel (usada por Karma/Webpack para las pruebas).
// Vite no usa Babel (usa esbuild), por lo que este archivo solo afecta a los specs.
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { esmodules: true } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
};
