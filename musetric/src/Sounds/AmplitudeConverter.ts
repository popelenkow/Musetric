import { RealIndexable } from '../Typed/RealIndexable';

/** Pseudo conversion. Rendering only */
export const convertAmplitudeToBel = (amplitudes: RealIndexable): void => {
	for (let i = 0; i < amplitudes.real.length; i++) {
		const amplitude = amplitudes.real[i];
		const value = Math.log10(amplitude) / 5;
		const bel = Math.max(0, Math.min(1, value + 1));
		amplitudes.real[i] = bel;
	}
};
