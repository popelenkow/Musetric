import { ComplexArray } from '../../src';

export type FourierFixture = {
  name: string;
  windowSize: number;
  input: Float32Array;
  output: ComplexArray;
};

export const fourierFixtures: FourierFixture[] = [
  // 2-point fixtures
  {
    name: 'FFT 2-point: unit impulse',
    windowSize: 2,
    input: Float32Array.from([1, 0]),
    output: {
      real: Float32Array.from([1, 1]),
      imag: Float32Array.from([0, 0]),
    },
  },
  {
    name: 'FFT 2-point: constant signal',
    windowSize: 2,
    input: Float32Array.from([1, 1]),
    output: {
      real: Float32Array.from([2, 0]),
      imag: Float32Array.from([0, 0]),
    },
  },
  {
    name: 'FFT 2-point: linear ramp',
    windowSize: 2,
    input: Float32Array.from([0, 1]),
    output: {
      real: Float32Array.from([1, -1]),
      imag: Float32Array.from([0, 0]),
    },
  },

  // 4-point fixtures
  {
    name: 'FFT 4-point: unit impulse',
    windowSize: 4,
    input: Float32Array.from([1, 0, 0, 0]),
    output: {
      real: Float32Array.from([1, 1, 1, 1]),
      imag: Float32Array.from([0, 0, 0, 0]),
    },
  },
  {
    name: 'FFT 4-point: constant signal',
    windowSize: 4,
    input: Float32Array.from([1, 1, 1, 1]),
    output: {
      real: Float32Array.from([4, 0, 0, 0]),
      imag: Float32Array.from([0, 0, 0, 0]),
    },
  },
  {
    name: 'FFT 4-point: linear ramp',
    windowSize: 4,
    input: Float32Array.from([0, 1, 2, 3]),
    output: {
      real: Float32Array.from([6, -2, -2, -2]),
      imag: Float32Array.from([0, 2, 0, -2]),
    },
  },

  // 8-point fixtures
  {
    name: 'FFT 8-point: unit impulse',
    windowSize: 8,
    input: Float32Array.from([1, 0, 0, 0, 0, 0, 0, 0]),
    output: {
      real: Float32Array.from(new Array(8).fill(1)),
      imag: Float32Array.from(new Array(8).fill(0)),
    },
  },
  {
    name: 'FFT 8-point: constant signal',
    windowSize: 8,
    input: Float32Array.from(new Array(8).fill(1)),
    output: {
      real: Float32Array.from([8, ...new Array(7).fill(0)]),
      imag: Float32Array.from(new Array(8).fill(0)),
    },
  },
  {
    name: 'FFT 8-point: linear ramp',
    windowSize: 8,
    input: Float32Array.from([0, 1, 2, 3, 4, 5, 6, 7]),
    output: {
      real: Float32Array.from([28, -4, -4, -4, -4, -4, -4, -4]),
      imag: Float32Array.from([
        0, 9.656854, 4, 1.656854, 0, -1.656854, -4, -9.656854,
      ]),
    },
  },
  {
    name: 'FFT 8-point: single sine',
    windowSize: 8,
    input: Float32Array.from([
      0, 0.70710678, 1, 0.70710678, 0, -0.70710678, -1, -0.70710678,
    ]),
    output: {
      real: Float32Array.from(new Array(8).fill(0)),
      imag: Float32Array.from([0, -4, 0, 0, 0, 0, 0, 4]),
    },
  },

  // 16-point fixtures
  {
    name: 'FFT 16-point: unit impulse',
    windowSize: 16,
    input: Float32Array.from([1, ...new Array(15).fill(0)]),
    output: {
      real: Float32Array.from(new Array(16).fill(1)),
      imag: Float32Array.from(new Array(16).fill(0)),
    },
  },
  {
    name: 'FFT 16-point: constant signal',
    windowSize: 16,
    input: Float32Array.from(new Array(16).fill(1)),
    output: {
      real: Float32Array.from([16, ...new Array(15).fill(0)]),
      imag: Float32Array.from(new Array(16).fill(0)),
    },
  },
  {
    name: 'FFT 16-point: single sine',
    windowSize: 16,
    input: Float32Array.from([
      0, 0.38268343, 0.70710678, 0.92387953, 1, 0.92387953, 0.70710678,
      0.38268343, 0, -0.38268343, -0.70710678, -0.92387953, -1, -0.92387953,
      -0.70710678, -0.38268343,
    ]),
    output: {
      real: Float32Array.from(new Array(16).fill(0)),
      imag: Float32Array.from([0, -8, ...new Array(13).fill(0), 8]),
    },
  },
  {
    name: 'FFT 16-point: two-tone cos 3 & 5',
    windowSize: 16,
    input: Float32Array.from([
      2.0, 0.0, -1.414214, 0.0, 0.0, 0.0, 1.414214, 0.0, -2.0, 0.0, 1.414214,
      0.0, 0.0, 0.0, -1.414214, 0.0,
    ]),
    output: {
      real: Float32Array.from([0, 0, 0, 8, 0, 8, 0, 0, 0, 0, 0, 8, 0, 8, 0, 0]),
      imag: Float32Array.from(new Array(16).fill(0)),
    },
  },

  // 32-point fixtures
  {
    name: 'FFT 32-point: unit impulse',
    windowSize: 32,
    input: Float32Array.from([1, ...new Array(31).fill(0)]),
    output: {
      real: Float32Array.from(new Array(32).fill(1)),
      imag: Float32Array.from(new Array(32).fill(0)),
    },
  },
  {
    name: 'FFT 32-point: constant signal',
    windowSize: 32,
    input: Float32Array.from(new Array(32).fill(1)),
    output: {
      real: Float32Array.from([32, ...new Array(31).fill(0)]),
      imag: Float32Array.from(new Array(32).fill(0)),
    },
  },
  {
    name: 'FFT 32-point: single sine',
    windowSize: 32,
    input: Float32Array.from([
      0, 0.19509032, 0.38268343, 0.55557023, 0.70710678, 0.83146961, 0.92387953,
      0.98078528, 1, 0.98078528, 0.92387953, 0.83146961, 0.70710678, 0.55557023,
      0.38268343, 0.19509032, 0, -0.19509032, -0.38268343, -0.55557023,
      -0.70710678, -0.83146961, -0.92387953, -0.98078528, -1, -0.98078528,
      -0.92387953, -0.83146961, -0.70710678, -0.55557023, -0.38268343,
      -0.19509032,
    ]),
    output: {
      real: Float32Array.from(new Array(32).fill(0)),
      imag: Float32Array.from([0, -16, ...new Array(29).fill(0), 16]),
    },
  },
  {
    name: 'FFT 32-point: two-tone cos 3 & 5',
    windowSize: 32,
    input: Float32Array.from([
      2.0, 1.38704, 0.0, -1.175876, -1.414214, -0.785695, 0.0, 0.275899, 0.0,
      -0.275899, 0.0, 0.785695, 1.414214, 1.175876, 0.0, -1.38704, -2.0,
      -1.38704, 0.0, 1.175876, 1.414214, 0.785695, 0.0, -0.275899, 0.0,
      0.275899, 0.0, -0.785695, -1.414214, -1.175876, 0.0, 1.38704,
    ]),
    output: {
      real: Float32Array.from([
        0, 0, 0, 16, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 16, 0, 16, 0, 0,
      ]),
      imag: Float32Array.from(new Array(32).fill(0)),
    },
  },
];
