// Setup de las pruebas (patrón de la guía "Pruebas unitarias con React").
// - Matchers de @testing-library/jasmine-dom (toHaveClass, toBeVisible, ...)
// - Limpia el DOM renderizado después de cada prueba
// - Activa el entorno de `act` de React 18
// - Inyecta los estilos de Bootstrap (necesarios para verificar clases CSS)

import 'bootstrap/dist/css/bootstrap.min.css';
import matchers from '@testing-library/jasmine-dom';
import { cleanup } from '@testing-library/react';

// Interoperabilidad de exports (funciona con import default y con namespace)
const matchersCustom = matchers?.default?.default ?? matchers?.default ?? matchers;

beforeEach(() => {
  jasmine.getEnv().addMatchers(matchersCustom);
});

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => {
  cleanup();
});
