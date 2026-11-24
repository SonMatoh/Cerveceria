import matchers from '@testing-library/jasmine-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { cleanup } from '@testing-library/react';

const matchersCustom = matchers?.default?.default ?? matchers?.default ?? matchers;

beforeEach(() => {
  jasmine.getEnv().addMatchers(matchersCustom);
});

afterEach(() => {
  cleanup();
});