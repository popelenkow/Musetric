import { ComplexArray, createComplexArray, createFftBase, createDftBase, SpectrometerBase } from '../src';

const isArrayCloseTo = (arr1: ArrayLike<number>, arr2: ArrayLike<number>) => {
	if (arr1.length !== arr2.length) return false;
	const size = arr1.length;
	for (let i = 0; i < size; i++) {
		const diff = arr1[i] - arr2[i];
		if (Math.abs(diff) > 0.0000001) return false;
	}
	return true;
};

const testForward = (createSpectrometer: (windowSize: number) => SpectrometerBase) => {
	describe('forward', () => {
		const windowSize = 4;
		let input: ComplexArray;
		let output: ComplexArray;

		beforeEach(() => {
			input = createComplexArray(windowSize);
			input.real.set([0, 0, 0, 0]);
			input.imag.set([0, 0, 0, 0]);
			output = createComplexArray(windowSize);
		});

		it('[1, 1, 1, 1]', () => {
			input.real.set([1, 1, 1, 1]);
			createSpectrometer(windowSize).forward(input, output);
			expect(isArrayCloseTo(output.real, [4, 0, 0, 0])).toBeTruthy();
			expect(isArrayCloseTo(output.imag, [0, 0, 0, 0])).toBeTruthy();
		});

		it('[1, 0, 0, 0]', () => {
			input.real.set([1, 0, 0, 0]);
			createSpectrometer(windowSize).forward(input, output);
			expect(isArrayCloseTo(output.real, [1, 1, 1, 1])).toBeTruthy();
			expect(isArrayCloseTo(output.imag, [0, 0, 0, 0])).toBeTruthy();
		});

		it('[0, 1, 2, 3]', () => {
			input.real.set([0, 1, 2, 3]);
			createSpectrometer(windowSize).forward(input, output);
			expect(isArrayCloseTo(output.real, [6, -2, -2, -2])).toBeTruthy();
			expect(isArrayCloseTo(output.imag, [0, 2, 0, -2])).toBeTruthy();
		});

		it('[0, 1, 0, 1]', () => {
			input.real.set([0, 1, 0, 1]);
			createSpectrometer(windowSize).forward(input, output);
			expect(isArrayCloseTo(output.real, [2, 0, -2, 0])).toBeTruthy();
			expect(isArrayCloseTo(output.imag, [0, 0, 0, 0])).toBeTruthy();
		});
	});
};

const testInverse = (createSpectrometer: (windowSize: number) => SpectrometerBase) => {
	describe('inverse', () => {
		const windowSize = 4;
		let input: ComplexArray;
		let output: ComplexArray;

		beforeEach(() => {
			input = createComplexArray(windowSize);
			output = createComplexArray(windowSize);
		});

		it('[4, 0, 0, 0]', () => {
			input.real.set([4, 0, 0, 0]);
			createSpectrometer(windowSize).inverse(input, output);
			expect(isArrayCloseTo(output.real, [1, 1, 1, 1])).toBeTruthy();
			expect(isArrayCloseTo(output.imag, [0, 0, 0, 0])).toBeTruthy();
		});

		it('[1, 1, 1, 1]', () => {
			input.real.set([1, 1, 1, 1]);
			createSpectrometer(windowSize).inverse(input, output);
			expect(isArrayCloseTo(output.real, [1, 0, 0, 0])).toBeTruthy();
			expect(isArrayCloseTo(output.imag, [0, 0, 0, 0])).toBeTruthy();
		});

		it('[6, -2, -2, -2],[0, 2, 0, -2]', () => {
			input.real.set([6, -2, -2, -2]);
			input.imag.set([0, 2, 0, -2]);
			createSpectrometer(windowSize).inverse(input, output);
			expect(isArrayCloseTo(output.real, [0, 1, 2, 3])).toBeTruthy();
			expect(isArrayCloseTo(output.imag, [0, 0, 0, 0])).toBeTruthy();
		});

		it('[2, 0, -2, 0]', () => {
			input.real.set([2, 0, -2, 0]);
			createSpectrometer(windowSize).inverse(input, output);
			expect(isArrayCloseTo(output.real, [0, 1, 0, 1])).toBeTruthy();
			expect(isArrayCloseTo(output.imag, [0, 0, 0, 0])).toBeTruthy();
		});
	});
};

describe('dft', () => {
	testForward(createDftBase);
	testInverse(createDftBase);
});

describe('fft', () => {
	testForward(createFftBase);
	testInverse(createFftBase);
});
