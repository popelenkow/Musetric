import { useMemo, useCallback, useEffect, useState } from 'react';
import {
	Theme, parseThemeRgbColor, PerformanceMonitorRef,
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
	const { content, background, active } = parseThemeRgbColor(theme);

	const step = (input.length - 1) / (frame.width - 1);
	for (let x = 0; x < frame.width; x++) {
		const offset = Math.round(x * step);
		const spectrum = input[offset];

		for (let y = 0; y < frame.height; y++) {
			const value = spectrum[y];
			const yIndex = 4 * y * frame.width;
			const index = 4 * x + yIndex;
			output[index] = (content.r * value + background.r * (1 - value));
			output[index + 1] = (content.g * value + background.g * (1 - value));
			output[index + 2] = (content.b * value + background.b * (1 - value));
			output[index + 3] = 255;
		}
	}

	if (typeof cursor === 'number') {
		const x = Math.round(cursor * (frame.width - 1));
		const color = active;
		for (let y = 0; y < frame.height; y++) {
			const yIndex = 4 * y * frame.width;
			const index = 4 * x + yIndex;
			output[index + 0] = color.r;
			output[index + 1] = color.g;
			output[index + 2] = color.b;
			output[index + 3] = 255;
		}
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

	const windowSize = useMemo(() => size.height * 2, [size]);
	const asyncFft = useMemo(() => createAsyncFft(), []);

	useEffect(() => {
		if (pause) return undefined;
		asyncFft.start().finally(() => {});
		return () => { asyncFft.stop().finally(() => {}); };
	}, [asyncFft, pause]);

	const fftCount = useMemo(() => 70, []);
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
		const value = Math.round(cursorPosition.x * (soundBuffer.memorySize - 1));
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
