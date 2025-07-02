import { expect } from 'vitest';
import type { ComplexArray } from '../../src';

export type FftFixtures = {
  name: string;
  windowSize: number;
  input: ComplexArray;
  output: ComplexArray;
};

export const fftFixtures: FftFixtures[] = [
  {
    name: 'FFT 2-point (sum & difference)',
    windowSize: 2,
    input: {
      real: Float32Array.from([1, 2]),
      imag: Float32Array.from([0, 0]),
    },
    output: {
      real: Float32Array.from([3, -1]),
      imag: Float32Array.from([0, 0]),
    },
  },
  {
    name: 'FFT 2-point (constant signal)',
    windowSize: 2,
    input: {
      real: Float32Array.from([1, 1]),
      imag: Float32Array.from([0, 0]),
    },
    output: {
      real: Float32Array.from([2, 0]),
      imag: Float32Array.from([0, 0]),
    },
  },
  {
    name: 'FFT 4-point (linear ramp)',
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
    name: 'FFT 4-point (constant signal)',
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
    name: 'FFT 4-point (unit impulse)',
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
    name: 'FFT 4-point (alternating pattern)',
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
    name: 'FFT 8-point (sequential ramp)',
    windowSize: 8,
    input: {
      real: Float32Array.from([0, 1, 2, 3, 4, 5, 6, 7]),
      imag: Float32Array.from([0, 0, 0, 0, 0, 0, 0, 0]),
    },
    output: {
      real: Float32Array.from([28, -4, -4, -4, -4, -4, -4, -4]),
      imag: Float32Array.from([
        0, 9.6568546295, 3.9999997616, 1.6568539143, 0, -1.6568541527,
        -3.9999997616, -9.6568536758,
      ]),
    },
  },
  {
    name: 'FFT 8-point (random complex)',
    windowSize: 8,
    input: {
      real: Float32Array.from([0, 1, 0, 1, 5, 8, 1, 4]),
      imag: Float32Array.from([-6, 7, 1, 1, 1, 6, 1, -6]),
    },
    output: {
      real: Float32Array.from([
        20, -2.1715729237, 22, 3.4852809906, -8, -7.8284273148, -14,
        -13.4852809906,
      ]),
      imag: Float32Array.from([
        5, -3.1715729237, -11, 3.3137078285, -11, -8.8284273148, -3.0000002384,
        -19.3137073517,
      ]),
    },
  },
  {
    name: 'FFT 16-point (impulse)',
    windowSize: 16,
    input: {
      real: Float32Array.from([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      imag: Float32Array.from(new Array(16).fill(0)),
    },
    output: {
      real: Float32Array.from(new Array(16).fill(1)),
      imag: Float32Array.from(new Array(16).fill(0)),
    },
  },
  {
    name: 'FFT 16-point (constant signal)',
    windowSize: 16,
    input: {
      real: Float32Array.from(new Array(16).fill(1)),
      imag: Float32Array.from(new Array(16).fill(0)),
    },
    output: {
      real: Float32Array.from([16, ...new Array(15).fill(0)]),
      imag: Float32Array.from(new Array(16).fill(0)),
    },
  },
  {
    name: 'FFT 16-point (alternating pattern)',
    windowSize: 16,
    input: {
      real: Float32Array.from([0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]),
      imag: Float32Array.from(new Array(16).fill(0)),
    },
    output: {
      real: Float32Array.from([
        8, 0, 0, 0, 0, 0, 0, 0, -8, 0, 0, 0, 0, 0, 0, 0,
      ]),
      imag: Float32Array.from(new Array(16).fill(0)),
    },
  },
  {
    name: 'FFT 16-point (linear ramp)',
    windowSize: 16,
    input: {
      real: Float32Array.from([
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
      ]),
      imag: Float32Array.from(new Array(16).fill(0)),
    },
    output: {
      real: Float32Array.from([
        120, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8,
      ]),
      imag: Float32Array.from([
        0, 40.218715937, 19.313708499, 11.9728461013, 8, 5.3454291034,
        3.313708499, 1.591298939, 0, -1.591298939, -3.313708499, -5.3454291034,
        -8, -11.9728461013, -19.313708499, -40.218715937,
      ]),
    },
  },
  {
    name: 'FFT 32-point (impulse)',
    windowSize: 32,
    input: {
      real: Float32Array.from([1, ...new Array(31).fill(0)]),
      imag: Float32Array.from(new Array(32).fill(0)),
    },
    output: {
      real: Float32Array.from(new Array(32).fill(1)),
      imag: Float32Array.from(new Array(32).fill(0)),
    },
  },
  {
    name: 'FFT 32-point (constant signal)',
    windowSize: 32,
    input: {
      real: Float32Array.from(new Array(32).fill(1)),
      imag: Float32Array.from(new Array(32).fill(0)),
    },
    output: {
      real: Float32Array.from([32, ...new Array(31).fill(0)]),
      imag: Float32Array.from(new Array(32).fill(0)),
    },
  },
  {
    name: 'FFT 32-point (alternating pattern)',
    windowSize: 32,
    input: {
      real: Float32Array.from(
        Array.from({ length: 32 }, (_, i) => (i % 2 ? 0 : 1)).reverse(),
      ),
      imag: Float32Array.from(new Array(32).fill(0)),
    },
    output: {
      real: Float32Array.from([
        16,
        ...new Array(15).fill(0),
        -16,
        ...new Array(15).fill(0),
      ]),
      imag: Float32Array.from(new Array(32).fill(0)),
    },
  },
];

export const assertArrayClose = (
  name: string,
  received: Float32Array,
  expected: Float32Array,
) => {
  expect(received.length, `${name} length`).toBe(expected.length);
  for (let i = 0; i < expected.length; i++) {
    expect(received[i], `${name} index ${i}`).toBeCloseTo(expected[i], 2);
  }
};
