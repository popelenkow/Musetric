/* eslint-disable */

import benchmark from 'benchmark';
import { ComplexArray, createComplexArray, createFft } from '../src';

export const performanceFft = () => {
	const windowSize = 1024;
	const input: ComplexArray = createComplexArray(windowSize);
	const output: ComplexArray = createComplexArray(windowSize);

	const arr: number[] = [];
	for (let i = 0; i < windowSize; i++) {
		arr[i] = 0;
	}
	input.real.set(arr);
	input.imag.set(arr);

	const suite = new benchmark.Suite();
	for (let i = 64; i <= windowSize; i*=2) {
		const fft = createFft(i);
		suite.add(`fft ${i}`, () => {
			fft.forward(input, output);
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
