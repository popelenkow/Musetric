import { useMemo, useCallback, useEffect, useState } from 'react';
import {
	Theme, parseThemeRgbColor, parseThemeUint32Color, gradientUint32ByRgb, PerformanceMonitorRef,
	Size2D, Position2D, createSpectrum,
	useAppCssContext, useAnimation, createFrequenciesView,
	SoundBuffer, SoundCircularBuffer, usePixelCanvas,
} from '..';

export type SpectrogramColors = {
	gradient: Uint32Array;
	active: number;
};
export const createSpectrogramColors = (theme: Theme) => {
	const { active } = parseThemeUint32Color(theme);
	const { content, background } = parseThemeRgbColor(theme);
	const gradient = gradientUint32ByRgb(background, content, 256);
	return { gradient, active };
};

export const drawSpectrogram = (
	input: Uint8Array[],
	output: Uint8ClampedArray,
	frame: Size2D,
	colors: SpectrogramColors,
	cursor?: number,
): void => {
	const { gradient, active } = colors;
	const out = new Uint32Array(output.buffer);

	const step = input.length / frame.height;
	let index = 0;
	for (let y = 0; y < frame.height; y++) {
		const offset = Math.floor(y * step);
		const spectrum = input[offset];
		for (let x = 0; x < frame.width; x++) {
			const colorIndex = spectrum[x];
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
	const colors = useMemo(() => createSpectrogramColors(css.theme), [css.theme]);

	const windowSize = useMemo(() => size.width * 2, [size]);
	const spectrum = useMemo(() => createSpectrum(), []);

	useEffect(() => {
		if (pause) return undefined;
		spectrum.start().finally(() => {});
		return () => { spectrum.stop().finally(() => {}); };
	}, [spectrum, pause]);

	const count = useMemo(() => 128, []);
	const [frequencies, setFrequencies] = useState<Uint8Array[]>();
	useEffect(() => {
		const run = async () => {
			const raw = await spectrum.setup({ windowSize, count });
			const result = createFrequenciesView(raw, windowSize, count);
			setFrequencies(result);
		};
		run().finally(() => {});
	}, [spectrum, windowSize, count]);

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
		spectrum.setSoundBuffer(buffer).finally(() => {});
	}, [spectrum, buffer]);

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
		drawSpectrogram(frequencies, pixelCanvas.image.data, size, colors, cursor);
		pixelCanvas.context.putImageData(pixelCanvas.image, 0, 0);

		performanceMonitor?.end();
	}, [
		soundBuffer, frequencies,
		pixelCanvas, colors,
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
