/** Pseudo conversion. Rendering only */
export const convertAmplitudeToBel = (amplitudes: Float32Array) => {
	for (let i = 0; i < amplitudes.length; i++) {
		const amplitude = amplitudes[i];
		const value = Math.log10(amplitude) / 5;
		const bel = Math.max(0, Math.min(1, value + 1));
		amplitudes[i] = bel;
	}
};
