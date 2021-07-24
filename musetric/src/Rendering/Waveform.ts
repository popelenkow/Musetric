import { useMemo, useCallback } from 'react';
import {
	Theme, parseThemeUint32Color,
	Size2D, Position2D, useAnimation, useAppCssContext,
	SoundBuffer, SoundCircularBuffer, PerformanceMonitorRef,
	usePixelCanvas,
} from '..';

export type Waves = {
	minArray: Float32Array;
	maxArray: Float32Array;
};

export const evalWaves = (
	input: Float32Array,
	output: Waves,
	frame: Size2D,
) => {
	const { minArray, maxArray } = output;
	const window = input.length / frame.height;
	const step = Math.max(1, Math.round(window / 20));
	for (let y = 0; y < frame.height; y++) {
		let min = 1.0;
		let max = -1.0;
		const offset = Math.floor(y * window);
		for (let i = 0; i < window; i += step) {
			const value = input[offset + i];
			if (value < min) min = value;
			if (value > max) max = value;
		}
		minArray[y] = min;
		maxArray[y] = max;
	}

	for (let y = 0; y < frame.height; y++) {
		minArray[y] = (1 + minArray[y]) * (frame.width / 2);
		maxArray[y] = (1 + maxArray[y]) * (frame.width / 2);
	}
};

export type WaveformColors = {
	content: number;
	background: number;
	active: number;
};
export const createWaveformColors = (theme: Theme): WaveformColors => {
	const { content, background, active } = parseThemeUint32Color(theme);
	return { content, background, active };
};

export const drawWaveform = (
	input: Waves,
	output: Uint8ClampedArray,
	frame: Size2D,
	colors: WaveformColors,
	cursor?: number,
): void => {
	const { content, background, active } = colors;
	const { minArray, maxArray } = input;
	const out = new Uint32Array(output.buffer);

	for (let y = 0; y < frame.height; y++) {
		const min = Math.ceil(minArray[y]);
		const max = Math.ceil(maxArray[y]);
		const index = y * frame.width;
		out.fill(background, index, index + min);
		out.fill(content, index + min, index + max);
		out.fill(background, index + max, index + frame.width);
	}

	if (typeof cursor === 'number') {
		const y = Math.round(cursor * (frame.height - 1));
		const index = y * frame.width;
		out.fill(active, index, index + frame.width);
	}
};

export type WaveformProps = {
	soundBuffer: SoundBuffer;
	soundCircularBuffer: SoundCircularBuffer;
	isLive?: boolean;
	size: Size2D;
	pause?: boolean;
	performanceMonitor?: PerformanceMonitorRef | null;
};

export const useWaveform = (props: WaveformProps) => {
	const {
		soundBuffer, soundCircularBuffer, isLive, size, pause, performanceMonitor,
	} = props;
	const { css } = useAppCssContext();
	const colors = useMemo(() => createWaveformColors(css.theme), [css.theme]);

	const getWaves = useMemo(() => {
		let waves: Waves | undefined;
		return (view: Size2D) => {
			if (!waves || (waves.minArray.length !== view.height)) {
				waves = {
					minArray: new Float32Array(view.height),
					maxArray: new Float32Array(view.height),
				};
			}
			return waves;
		};
	}, []);
	const draw = useCallback((output: Uint8ClampedArray, frame: Size2D) => {
		const buffer = isLive ? soundCircularBuffer.buffers[0] : soundBuffer.buffers[0];
		const cursor = isLive ? undefined : soundBuffer.cursor / (soundBuffer.memorySize - 1);
		const waves = getWaves(frame);
		evalWaves(buffer, waves, frame);
		drawWaveform(waves, output, frame, colors, cursor);
	}, [soundBuffer, soundCircularBuffer, isLive, colors, getWaves]);

	const onClick = useCallback((cursorPosition: Position2D) => {
		if (isLive) return;
		const value = Math.floor(cursorPosition.y * (soundBuffer.memorySize - 1));
		soundBuffer.setCursor(value);
	}, [soundBuffer, isLive]);

	const pixelCanvas = usePixelCanvas({ size });

	useAnimation(() => {
		if (pause) return;
		performanceMonitor?.begin();

		draw(pixelCanvas.image.data, pixelCanvas.size);
		pixelCanvas.context.putImageData(pixelCanvas.image, 0, 0);

		performanceMonitor?.end();
	}, [draw, pixelCanvas, pause, performanceMonitor]);

	return {
		image: pixelCanvas.canvas, onClick,
	};
};
