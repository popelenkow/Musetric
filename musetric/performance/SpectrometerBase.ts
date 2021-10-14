/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Suite } from 'benchmark';
import FFT from 'fft.js';
import { createComplexIndexable } from '../src/Typed/ComplexIndexable';
import { createFftRadix2Base } from '../src/Sounds/FftRadix2';
import { createFftRadix4Base } from '../src/Sounds/FftRadix4';

export const performanceFft = (): void => {
	const windowSize = 16384;
	const input = createComplexIndexable('float32', windowSize);
	const output = createComplexIndexable('list', windowSize);
	const arr: number[] = [];
	for (let i = 0; i < windowSize; i++) {
		arr[i] = 0;
	}
	for (let i = 0; i < windowSize; i++) {
		input.real[i] = arr[i];
		input.imag[i] = arr[i];
	}

	const run = (i: number) => {
		const suite = new Suite();
		const fftRadix2 = createFftRadix2Base(i);
		suite.add('fft2R', () => {
			fftRadix2.forward(input, output);
		});

		const fftRadix4 = createFftRadix4Base(i);
		suite.add('fft4R', () => {
			fftRadix4.forward(input, output);
		});

		const fftRadix4O = new FFT(i);
		const w1 = fftRadix4O.toComplexArray(input.real, null);
		const w2 = fftRadix4O.toComplexArray(output.real, null);
		suite.add('fft4O', () => {
			fftRadix4O.transform(w2, w1);
		});
		suite.on('cycle', (event: any) => {
			console.log(String(event.target));
		});
		suite.on('complete', () => {
		});
		console.log('');
		console.log(`forward ${i}`);
		suite.run({ async: false });
	};

	run(1024);
	run(2048);
	run(4096);
	run(8192);
	run(16384);
};
