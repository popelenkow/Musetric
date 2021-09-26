import { convertAmplitudeToBel } from './AmplitudeConverter';
import { RealArray, createRealArray, viewRealArray } from '../Typed/RealArray';
import { ComplexArray, createComplexArray } from '../Typed/ComplexArray';
import { ComplexIndexable, createComplexIndexable } from '../Typed/ComplexIndexable';
import { normComplexIndexable } from '../Typed/ComplexUtils';
import { RealIndexable } from '../Typed/RealIndexable';
import { gaussWindowFilter } from './WindowFilters';

export type SpectrometerBase = {
	forward: (input: ComplexArray, output: ComplexIndexable) => void;
	inverse: (input: ComplexArray, output: ComplexIndexable) => void;
};

export type SpectrometerFrequencyOptions = {
	convert?: (amplitudes: RealIndexable) => void;
};

export type SpectrometerFrequenciesOptions = {
	offset: number;
	step: number;
	count: number;
	convert?: (amplitudes: RealIndexable) => void;
};

export type Spectrometer = {
	forward: (input: ComplexArray, output: ComplexIndexable) => void;
	inverse: (input: ComplexArray, output: ComplexIndexable) => void;
	// eslint-disable-next-line max-len
	frequency: (input: RealArray, output: RealIndexable, options: SpectrometerFrequencyOptions) => void;
	frequencies: (
		input: RealArray, output: RealIndexable[], options: SpectrometerFrequenciesOptions,
	) => void;
	byteFrequencies: (
		input: RealArray, output: RealArray<'uint8'>[], options: SpectrometerFrequenciesOptions,
	) => void;
};
export const createSpectrometer = (windowSize: number, base: SpectrometerBase): Spectrometer => {
	const { forward, inverse } = base;
	const window = createComplexArray('float64', windowSize);
	const buf = createRealArray('float64', windowSize / 2);
	const frequency = createComplexIndexable('list', windowSize);
	const filter = gaussWindowFilter('float64', windowSize);

	const api: Spectrometer = {
		forward,
		inverse,
		frequency: (
			input: RealArray,
			output: RealIndexable,
			options: SpectrometerFrequencyOptions,
		) => {
			const { convert = convertAmplitudeToBel } = options;
			for (let i = 0; i < windowSize; i++) {
				window.real[i] = input.real[i] * filter.real[i];
				window.imag[i] = 0;
			}
			forward(window, frequency);
			normComplexIndexable(frequency, output, 1 / windowSize);
			convert(output);
		},
		frequencies: (
			input: RealArray,
			output: RealIndexable[],
			options: SpectrometerFrequenciesOptions,
		) => {
			const { step, count, convert } = options;
			let { offset } = options;
			for (let i = 0; i < count; i++) {
				const view = viewRealArray(input, Math.floor(offset), windowSize);
				api.frequency(view, output[i], { convert });
				offset += step;
			}
		},
		byteFrequencies: (
			input: RealArray,
			output: RealArray<'uint8'>[],
			options: SpectrometerFrequenciesOptions,
		) => {
			const { step, count, convert } = options;
			let { offset } = options;
			for (let i = 0; i < count; i++) {
				const view = viewRealArray(input, Math.floor(offset), windowSize);
				api.frequency(view, buf, { convert });
				for (let j = 0; j < windowSize / 2; j++) {
					output[i].real[j] = Math.round(buf.real[j] * 255);
				}
				offset += step;
			}
		},
	};
	return api;
};
