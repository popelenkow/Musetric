import { convertAmplitudeToBel } from './AmplitudeConverter';
import { RealArray, ComplexArray, createComplexArray, normComplexArray, createRealArray } from './ComplexArray';
import { gaussWindowFilter } from './WindowFilters';

export type SpectrometerBase = {
	forward: (input: ComplexArray, output: ComplexArray) => void;
	inverse: (input: ComplexArray, output: ComplexArray) => void;
};

export type SpectrometerFrequencyOptions = {
	convert?: (amplitudes: RealArray) => void;
};

export type SpectrometerFrequenciesOptions = {
	offset: number;
	step: number;
	count: number;
	convert?: (amplitudes: RealArray) => void;
};

export const createSpectrometer = (windowSize: number, base: SpectrometerBase) => {
	const { forward, inverse } = base;
	const window = createComplexArray(windowSize, 'list');
	const buf = createRealArray(windowSize / 2, 'float64');
	const frequency = createComplexArray(windowSize, 'list');
	const filter = gaussWindowFilter(windowSize, 'list');

	const api = {
		forward,
		inverse,
		frequency: (
			input: RealArray,
			output: RealArray,
			options: SpectrometerFrequencyOptions,
		) => {
			const { convert = convertAmplitudeToBel } = options;
			for (let i = 0; i < windowSize; i++) {
				window.real[i] = input[i] * filter[i];
				window.imag[i] = 0;
			}
			forward(window, frequency);
			normComplexArray(frequency, output, 1 / windowSize);
			convert(output);
		},
		frequencies: (
			input: Float32Array,
			output: Float32Array[],
			options: SpectrometerFrequenciesOptions,
		) => {
			const { step, count, convert } = options;
			let { offset } = options;
			for (let i = 0; i < count; i++) {
				const index = Math.floor(offset) * Float32Array.BYTES_PER_ELEMENT;
				const view = new Float32Array(input.buffer, index, windowSize);
				api.frequency(view, output[i], { convert });
				offset += step;
			}
		},
		byteFrequencies: (
			input: Float32Array,
			output: Uint8Array[],
			options: SpectrometerFrequenciesOptions,
		) => {
			const { step, count, convert } = options;
			let { offset } = options;
			for (let i = 0; i < count; i++) {
				const index = Math.floor(offset) * Float32Array.BYTES_PER_ELEMENT;
				const view = new Float32Array(input.buffer, index, windowSize);
				api.frequency(view, buf, { convert });
				for (let j = 0; j < windowSize / 2; j++) {
					output[i][j] = Math.round(buf[j] * 255);
				}
				offset += step;
			}
		},
	};
	return api;
};
export type Spectrometer = ReturnType<typeof createSpectrometer>;
