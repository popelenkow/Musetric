import { describe, it, expect } from 'vitest';
import { ComplexArray, createFftRadix4Base } from '../src';

type Samples = {
  windowSize: number;
  input: ComplexArray;
  output: ComplexArray;
};

const samples: Samples[] = [
  {
    windowSize: 4,
    input: {
      real: Float32Array.from([0, 1, 2, 3]),
      imag: Float32Array.from([0, 0, 0, 0]),
    },
    output: {
      real: Float32Array.from([6, -2, -2, -2]),
      imag: Float32Array.from([0, 2, 0, -2]),
    },
  },
  {
    windowSize: 4,
    input: {
      real: Float32Array.from([1, 1, 1, 1]),
      imag: Float32Array.from([0, 0, 0, 0]),
    },
    output: {
      real: Float32Array.from([4, 0, 0, 0]),
      imag: Float32Array.from([0, 0, 0, 0]),
    },
  },
  {
    windowSize: 4,
    input: {
      real: Float32Array.from([1, 0, 0, 0]),
      imag: Float32Array.from([0, 0, 0, 0]),
    },
    output: {
      real: Float32Array.from([1, 1, 1, 1]),
      imag: Float32Array.from([0, 0, 0, 0]),
    },
  },
  {
    windowSize: 4,
    input: {
      real: Float32Array.from([0, 1, 0, 1]),
      imag: Float32Array.from([0, 0, 0, 0]),
    },
    output: {
      real: Float32Array.from([2, 0, -2, 0]),
      imag: Float32Array.from([0, 0, 0, 0]),
    },
  },
  {
    windowSize: 8,
    input: {
      real: Float32Array.from([0, 1, 2, 3, 4, 5, 6, 7]),
      imag: Float32Array.from([0, 0, 0, 0, 0, 0, 0, 0]),
    },
    output: {
      real: Float32Array.from([28, -4, -4, -4, -4, -4, -4, -4]),
      imag: Float32Array.from([
        0, 9.656854629516602, 3.999999761581421, 1.6568539142608643, 0,
        -1.6568541526794434, -3.999999761581421, -9.656853675842285,
      ]),
    },
  },
  {
    windowSize: 8,
    input: {
      real: Float32Array.from([0, 1, 0, 1, 5, 8, 1, 4]),
      imag: Float32Array.from([-6, 7, 1, 1, 1, 6, 1, -6]),
    },
    output: {
      real: Float32Array.from([
        20, -2.1715729236602783, 22, 3.485280990600586, -8, -7.828427314758301,
        -13.999999046325684, -13.485280990600586,
      ]),
      imag: Float32Array.from([
        5, -3.1715729236602783, -11, 3.3137078285217285, -11,
        -8.828427314758301, -3.000000238418579, -19.31370735168457,
      ]),
    },
  },
];

const assertClose = (received: Float32Array, expected: Float32Array) => {
  expect(received.length).toBe(expected.length);
  for (let i = 0; i < expected.length; i++) {
    expect(received[i]).toBeCloseTo(expected[i], 5);
  }
};

describe('createFftRadix4Base', () => {
  describe('forward', () => {
    samples.forEach((sample) => {
      it(`forward ${sample.windowSize}`, () => {
        const output: ComplexArray = {
          real: new Float32Array(sample.windowSize),
          imag: new Float32Array(sample.windowSize),
        };
        createFftRadix4Base(sample.windowSize).forward(sample.input, output);
        assertClose(output.real, sample.output.real);
        assertClose(output.imag, sample.output.imag);
      });
    });
  });

  describe('inverse', () => {
    samples.forEach((sample) => {
      it(`inverse ${sample.windowSize}`, () => {
        const output: ComplexArray = {
          real: new Float32Array(sample.windowSize),
          imag: new Float32Array(sample.windowSize),
        };
        createFftRadix4Base(sample.windowSize).inverse(sample.output, output);
        assertClose(output.real, sample.input.real);
        assertClose(output.imag, sample.input.imag);
      });
    });
  });
});
