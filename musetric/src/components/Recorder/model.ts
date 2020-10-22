import { Recorder } from './recorder';

export type Model = {
	recorder: Recorder;
	audioContext: AudioContext;
	analyserNode: AnalyserNode;
}

export type DrawInfo<TData> = {
	canvas?: HTMLCanvasElement | null;
	data: TData;
}

export const drawWave = (info: DrawInfo<Float32Array>) => {
	const { canvas, data } = info;
	if (!canvas) return;
	const context = canvas.getContext('2d');
	if (!context) return;
	const { width, height } = canvas;

	const step = Math.ceil(data.length / width);
	const amp = height / 2;
	context.fillStyle = 'silver';
	context.clearRect(0, 0, width, height);
	for (let i = 0; i < width; i++) {
		let min = 1.0;
		let max = -1.0;
		for (let j = 0; j < step; j++) {
			const datum = data[(i * step) + j];
			if (datum < min) {
				min = datum;
			}
			if (datum > max) {
				max = datum;
			}
		}
		context.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
	}
};

export const drawSpectrum = (info: DrawInfo<Uint8Array>, frequencyBinCount: number) => {
	const { canvas, data } = info;
	if (!canvas) return;
	const context = canvas.getContext('2d');
	if (!context) return;
	const { width, height } = canvas;

	const spacing = 10;
	const myWidth = 10;
	const numBars = Math.round(width / spacing);
	context.fillStyle = 'black';
	context.lineCap = 'round';
	context.clearRect(0, 0, width, height);

	const multiplier = Math.floor(frequencyBinCount / numBars);

	for (let i = 0; i < numBars; i++) {
		let magnitude = 0;
		const offset = Math.floor(i * multiplier);
		for (let j = 0; j < multiplier; j++) {
			magnitude += data[offset + j];
		}
		magnitude = (magnitude / multiplier / 255) * height;
		context.fillStyle = `hsl( ${Math.round((i * 360) / numBars)}, 100%, 50%)`;
		context.fillRect(i * spacing, height, myWidth, -magnitude);
	}
};

type AnimationSubscription = { stop: () => void };

export const startAnimation = (draw: () => void): AnimationSubscription => {
	let id: number;
	const loop = () => {
		draw();
		id = requestAnimationFrame(loop);
	};
	id = requestAnimationFrame(loop);
	return { stop: () => cancelAnimationFrame(id) };
};
