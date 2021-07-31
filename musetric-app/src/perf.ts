/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import FFT from 'fft.js';
import { createComplexArray } from 'musetric/Sounds/ComplexArray';
import { createFftRadix2Base } from 'musetric/Sounds/FftRadix2';
import { createFftRadix4Base } from 'musetric/Sounds/FftRadix4';

const add = (dt: number, t1: number, t2: number) => {
	return 0.95 * dt + 0.05 * (t2 - t1);
};

export const performanceFft = () => {
	const q = document.getElementById('root');
	if (!q) throw new Error();

	let text = '';
	const windowSize = 16384;
	const input = createComplexArray(windowSize, 'float32');
	const output = createComplexArray(windowSize, 'list');
	const arr: number[] = [];
	for (let i = 0; i < windowSize; i++) {
		arr[i] = 0;
	}
	for (let i = 0; i < windowSize; i++) {
		input.real[i] = arr[i];
		input.imag[i] = arr[i];
	}

	const run = (i: number) => {
		const fftRadix2 = createFftRadix2Base(i);

		const L = 100;
		text += `forward ${i}\n`;

		let t1: number;
		let t2: number;
		let dt = 0;
		const log = (key: string) => {
			text += `${key} ${(1000 / dt).toFixed(0)}\n`;
		};
		const line = (t: string) => {
			text += `${t}\n`;
		};
		const perf = (key: string, task: () => void) => {
			for (let j = 0; j < L; j++) {
				t1 = performance.now();
				task();
				t2 = performance.now();
				if (j === 0) dt = 0;
				else dt = add(dt, t1, t2);
			}
			log(key);
		};
		perf('fft2R', () => fftRadix2.forward(input, output));

		const fftRadix4 = createFftRadix4Base(i);
		perf('fft4R', () => fftRadix4.forward(input, output));

		const fftRadix4O = new FFT(i);
		const w1 = fftRadix4O.toComplexArray(input.real, null);
		const w2 = fftRadix4O.toComplexArray(output.real, null);
		perf('fft4O', () => fftRadix4O.transform(w2, w1));
		line('');

		q.innerText = text;
	};

	run(1024);
	run(2048);
	run(4096);
	run(8192);
	run(16384);
};

performanceFft();
