import { RealIndexable } from '../TypedArray/RealIndexable';

type MapAmplitudeToDecibelOptions = {
	min: number;
	max: number;
};
export const mapAmplitudeToDecibel = (
	amplitudes: RealIndexable,
	options?: MapAmplitudeToDecibelOptions,
): void => {
	const { min = -125, max = 0 } = options || {};
	const factor = 1 / (max - min);
	for (let i = 0; i < amplitudes.real.length; i++) {
		const amplitude = amplitudes.real[i];
		const decibel = 20 * Math.log10(amplitude);
		const value = (decibel + max) * factor;
		const view = Math.max(0, Math.min(1, value + 1)); // [<min>dB, <max>dB]
		amplitudes.real[i] = view;
	}
};
