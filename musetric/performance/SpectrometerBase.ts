/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import benchmark from 'benchmark';
import FFT from 'fft.js';
import { ComplexArray, createComplexArray } from '../src/Sounds/ComplexArray';
import { createFftRadix2Base } from '../src/Sounds/FftRadix2';
import { createFftRadix4Base, createArrayRadix4 } from '../src/Sounds/FftRadix4';

export const performanceFft = () => {
	const windowSize = 16384;
	const input: ComplexArray = createComplexArray(windowSize);
	const output: ComplexArray = createComplexArray(windowSize);

	const arr: number[] = [];
	for (let i = 0; i < windowSize; i++) {
		arr[i] = 0;
	}
	input.real.set(arr);
	input.imag.set(arr);

	const suite = new benchmark.Suite();
	for (let i = 1024; i <= windowSize; i *= 4) {
		const fftRadix2 = createFftRadix2Base(i);
		suite.add(`fft2R.forward ${i}`, () => {
			fftRadix2.forward(input, output);
		});

		const fftRadix4 = createFftRadix4Base(i);
		suite.add(`fft4R.forward ${i}`, () => {
			fftRadix4.forward(input, output);
		});

		const fftRadix4I = createFftRadix4Base(i);
		const q = createArrayRadix4(i);
		const q1 = q.toComplexArray(input.real);
		const q2 = q.toComplexArray(output.real);
		suite.add(`fft4I.forward ${i}`, () => {
			fftRadix4I.transform(q1, q2);
		});

		const fftRadix4O = new FFT(i);
		const w1 = fftRadix4O.toComplexArray(input.real, null);
		const w2 = fftRadix4O.toComplexArray(output.real, null);
		suite.add(`fft4O.forward ${i}`, () => {
			fftRadix4O.transform(w2, w1);
		});
	}
	suite.on('cycle', (event: any) => {
		console.log(String(event.target));
	});
	suite.on('complete', (ev: any) => {
		ev;
	});
	suite.run({ async: false });
};
