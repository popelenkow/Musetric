/* eslint-disable */
import {
	createComplexArray, SpectrometerBase,
	createDftBase, createFftRadix2Base, createFftRadix4Base,
} from '../src';

const toStringArray = (input: ArrayLike<number>) => {
	const arr = Array.from<number>(input);
	return `[${arr.join(', ')}]`;
};
const isArrayCloseTo = (arr1: ArrayLike<number>, arr2: ArrayLike<number>) => {
	if (arr1.length !== arr2.length) return false;
	const size = arr1.length;
	for (let i = 0; i < size; i++) {
		const diff = arr1[i] - arr2[i];
		if (Math.abs(diff) > 0.00001) return false;
	}
	return true;
};

declare global {
	namespace jest {
		interface Matchers<R> {
			toBeArrayCloseTo(expected: ArrayLike<number>): R;
		}
	}
}
expect.extend({
	toBeArrayCloseTo: (received: ArrayLike<number>, expected: ArrayLike<number>) => {
		const pass = isArrayCloseTo(received, expected);
		return {
			message: () => `${toStringArray(received)} to be close ${toStringArray(expected)}`,
			pass,
		};
	},
});

const testTransform = (createSpectrometer: (windowSize: number) => SpectrometerBase) => {
	const create = (windowSize: number, real: number[], imag: number[]) => {
		const input = createComplexArray(windowSize);
		const output = createComplexArray(windowSize);
		input.real.set(real);
		input.imag.set(imag);
		return { input, output };
	};
	const arr: { windowSize: number, inputR: number[], inputI: number[], outputR: number[], outputI: number[] }[] = [
		{ windowSize: 4, inputR: [0, 1, 2, 3], inputI: [0, 0, 0, 0], outputR: [6, -2, -2, -2], outputI: [0, 2, 0, -2] },
		{ windowSize: 4, inputR: [1, 1, 1, 1], inputI: [0, 0, 0, 0], outputR: [4, 0, 0, 0], outputI: [0, 0, 0, 0] },
		{ windowSize: 4, inputR: [1, 0, 0, 0], inputI: [0, 0, 0, 0], outputR: [1, 1, 1, 1], outputI: [0, 0, 0, 0] },
		{ windowSize: 4, inputR: [0, 1, 0, 1], inputI: [0, 0, 0, 0], outputR: [2, 0, -2, 0], outputI: [0, 0, 0, 0] },
		{ windowSize: 8, inputR: [0, 1, 2, 3, 4, 5, 6, 7], inputI: [0, 0, 0, 0, 0, 0, 0, 0], outputR:[28, -4, -4, -4, -4, -4, -4, -4], outputI: [0, 9.656854629516602, 3.999999761581421, 1.6568539142608643, 0, -1.6568541526794434, -3.999999761581421, -9.656853675842285] },
		{ windowSize: 8, inputR: [0, 1, 0, 1, 5, 8, 1, 4], inputI: [-6, 7, 1, 1, 1, 6, 1, -6], outputR: [20, -2.1715729236602783, 22, 3.485280990600586, -8, -7.828427314758301, -13.999999046325684, -13.485280990600586], outputI: [5, -3.1715729236602783, -11, 3.3137078285217285, -11, -8.8284273147583, -3.000000238418579, -19.31370735168457] },
	];
	describe('forward', () => {
		for (let i = 0; i < arr.length; i++) {
			const { windowSize, inputR, inputI, outputR, outputI } = arr[i];
			it(`${toStringArray(inputR)}, ${toStringArray(inputI)}`, () => {
				const { input, output } = create(windowSize, inputR, inputI);
				createSpectrometer(windowSize).forward(input, output);
				expect(output.real).toBeArrayCloseTo(outputR);
				expect(output.imag).toBeArrayCloseTo(outputI);
			});
		}
	});
	describe('inverse', () => {
		for (let i = 0; i < arr.length; i++) {
			const { windowSize, inputR, inputI, outputR, outputI } = arr[i];
			it(`${toStringArray(outputR)}, ${toStringArray(outputI)}`, () => {
				const { input, output } = create(windowSize, outputR, outputI);
				createSpectrometer(windowSize).inverse(input, output);
				expect(output.real).toBeArrayCloseTo(inputR);
				expect(output.imag).toBeArrayCloseTo(inputI);
			});
		}
	});
};

describe('dft', () => {
	testTransform(createDftBase);
});

describe('fft2', () => {
	testTransform(createFftRadix2Base);
});

describe('fft4', () => {
	testTransform(createFftRadix4Base);
});
