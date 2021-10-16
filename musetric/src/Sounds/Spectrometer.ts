import { mapAmplitudeToDecibel } from './AmplitudeToDecibel';
import { ComplexIndexable, createComplexIndexable } from '../Typed/ComplexIndexable';
import { normComplexIndexable } from '../Typed/ComplexUtils';
import { RealIndexable, createRealIndexable } from '../Typed/RealIndexable';
import { gaussWindowFilter } from './WindowFilters';

export type SpectrometerBase = {
	forward: (input: ComplexIndexable, output: ComplexIndexable) => void;
	inverse: (input: ComplexIndexable, output: ComplexIndexable) => void;
};

export type SpectrometerFrequencyOptions = {
	convert?: (amplitudes: RealIndexable) => void;
};

export type Spectrometer = SpectrometerBase & {
	frequency: (
		input: RealIndexable, output: RealIndexable, options: SpectrometerFrequencyOptions
	) => void;
	byteFrequency: (
		input: RealIndexable, output: RealIndexable, options: SpectrometerFrequencyOptions
	) => void;
};
export const createSpectrometer = (windowSize: number, base: SpectrometerBase): Spectrometer => {
	const { forward, inverse } = base;
	const window = createComplexIndexable('float64', windowSize);
	const buf = createRealIndexable('float64', windowSize / 2);
	const frequency = createComplexIndexable('list', windowSize);
	const filter = gaussWindowFilter('float64', windowSize);

	const api: Spectrometer = {
		forward,
		inverse,
		frequency: (
			input: RealIndexable,
			output: RealIndexable,
			options: SpectrometerFrequencyOptions,
		) => {
			const { convert = mapAmplitudeToDecibel } = options;
			for (let i = 0; i < windowSize; i++) {
				window.real[i] = input.real[i] * filter.real[i];
				window.imag[i] = 0;
			}
			forward(window, frequency);
			normComplexIndexable(frequency, output, 1 / windowSize);
			convert(output);
		},
		byteFrequency: (
			input: RealIndexable,
			output: RealIndexable,
			options: SpectrometerFrequencyOptions,
		) => {
			api.frequency(input, buf, options);
			for (let j = 0; j < windowSize / 2; j++) {
				output.real[j] = Math.round(buf.real[j] * 255);
			}
		},
	};
	return api;
};
