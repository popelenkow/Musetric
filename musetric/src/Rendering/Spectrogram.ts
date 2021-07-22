import { useMemo, useCallback, useEffect, useState } from 'react';
import {
	Theme, parseThemeRgbColor, parseThemeUint32Color, gradientUint32ByRgb, PerformanceMonitorRef,
	Size2D, Position2D, createAsyncFft,
	useAppCssContext, useAnimation, createFrequenciesView,
	SoundBuffer, SoundCircularBuffer, usePixelCanvas,
} from '..';

export const drawSpectrogram = (
	input: Float32Array[],
	output: Uint8ClampedArray,
	frame: Size2D,
	theme: Theme,
	cursor?: number,
): void => {
	const count = 256;
	const { active } = parseThemeUint32Color(theme);
	const { content, background } = parseThemeRgbColor(theme);
	const gradient = gradientUint32ByRgb(background, content, count);
	const out = new Uint32Array(output.buffer);

	const step = input.length / frame.height;
	let index = 0;
	for (let y = 0; y < frame.height; y++) {
		const offset = Math.floor(y * step);
		const spectrum = input[offset];
		for (let x = 0; x < frame.width; x++) {
			const value = spectrum[x];
			const colorIndex = Math.round(value * (count - 1));
			out[index] = gradient[colorIndex];
			index++;
		}
	}

	if (typeof cursor === 'number') {
		const y = Math.round(cursor * (frame.height - 1));
		index = y * frame.width;
		out.fill(active, index, index + frame.width);
	}
};

export type SpectrogramProps = {
	soundBuffer: SoundBuffer;
	soundCircularBuffer: SoundCircularBuffer;
	isLive?: boolean;
	size: Size2D;
	pause?: boolean;
	performanceMonitor?: PerformanceMonitorRef | null;
};

export const useSpectrogram = (props: SpectrogramProps) => {
	const {
		soundBuffer, soundCircularBuffer, isLive, size, pause, performanceMonitor,
	} = props;
	const { css } = useAppCssContext();

	const windowSize = useMemo(() => size.width * 2, [size]);
	const asyncFft = useMemo(() => createAsyncFft(), []);

	useEffect(() => {
		if (pause) return undefined;
		asyncFft.start().finally(() => {});
		return () => { asyncFft.stop().finally(() => {}); };
	}, [asyncFft, pause]);

	const fftCount = useMemo(() => 1000, []);
	const [frequencies, setFrequencies] = useState<Float32Array[]>();
	useEffect(() => {
		const run = async () => {
			const raw = await asyncFft.setup({ windowSize, fftCount });
			const result = createFrequenciesView(raw, windowSize, fftCount);
			setFrequencies(result);
		};
		run().finally(() => {});
	}, [asyncFft, windowSize, fftCount]);

	const [buffer, setBuffer] = useState<SharedArrayBuffer>();

	useAnimation(() => {
		if (pause) return;
		const buf = isLive ? soundCircularBuffer.rawBuffers[0] : soundBuffer.rawBuffers[0];
		if (buf !== buffer) {
			setBuffer(buf);
		}
	}, [
		pause, buffer, soundBuffer, soundCircularBuffer, isLive,
	]);

	useEffect(() => {
		if (!buffer) return;
		asyncFft.setSoundBuffer(buffer).finally(() => {});
	}, [asyncFft, buffer]);

	const onClick = useCallback((cursorPosition: Position2D) => {
		if (isLive) return;
		const value = Math.round(cursorPosition.y * (soundBuffer.memorySize - 1));
		soundBuffer.setCursor(value);
	}, [soundBuffer, isLive]);

	const pixelCanvas = usePixelCanvas({ size });

	useAnimation(() => {
		if (pause) return;
		if (!frequencies) return;
		performanceMonitor?.begin();

		const cursor = isLive ? undefined : soundBuffer.cursor / (soundBuffer.memorySize - 1);
		drawSpectrogram(frequencies, pixelCanvas.image.data, size, css.theme, cursor);
		pixelCanvas.context.putImageData(pixelCanvas.image, 0, 0);

		performanceMonitor?.end();
	}, [
		soundBuffer, frequencies,
		pixelCanvas, css,
		isLive, size,
		pause, performanceMonitor,
	]);

	const result = useMemo(() => {
		return {
			image: pixelCanvas.canvas, onClick,
		};
	}, [pixelCanvas.canvas, onClick]);
	return result;
};
