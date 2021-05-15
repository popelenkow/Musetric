import React, { useMemo, useCallback } from 'react';
import {
	ColorTheme, parseColorThemeRgb,
	Layout2D, Size2D, getCanvasCursorPosition,
	SoundBuffer, SoundCircularBuffer,
	CanvasViewProps,
} from '..';

export type CacheDrawWaveform = {
	minArray: Float32Array;
	maxArray: Float32Array;
};

export const drawWaveform = (
	input: Float32Array,
	output: Uint8ClampedArray,
	layout: Layout2D,
	colorTheme: ColorTheme,
	cache?: CacheDrawWaveform,
	cursor?: number,
): CacheDrawWaveform => {
	const { position, view, frame } = layout;

	const { content, background, active } = parseColorThemeRgb(colorTheme);

	if (!cache || (cache.minArray.length !== view.width)) {
		cache = {
			minArray: new Float32Array(view.width),
			maxArray: new Float32Array(view.width),
		};
	}
	const { minArray, maxArray } = cache;

	const step = input.length / view.width;
	for (let x = 0; x < view.width; x++) {
		let min = 1.0;
		let max = -1.0;
		const offset = Math.floor(x * step);
		for (let i = 0; i < step; i++) {
			const value = input[offset + i];
			if (value < min) min = value;
			if (value > max) max = value;
		}
		minArray[x] = min;
		maxArray[x] = max;
	}

	for (let x = 0; x < view.width; x++) {
		minArray[x] = (1 + minArray[x]) * (view.height / 2);
		maxArray[x] = (1 + maxArray[x]) * (view.height / 2);
	}

	for (let y = 0; y < view.height; y++) {
		const yIndex = 4 * (position.y + y) * frame.width;
		for (let x = 0; x < view.width; x++) {
			const min = minArray[x];
			const max = maxArray[x];
			const isDraw = (min <= y) && (y <= max);
			const color = isDraw ? content : background;
			const index = 4 * (position.x + x) + yIndex;
			output[index + 0] = color.r;
			output[index + 1] = color.g;
			output[index + 2] = color.b;
			output[index + 3] = 255;
		}
	}

	if (typeof cursor === 'number') {
		const x = Math.round(cursor * (view.width - 1));
		const color = active;
		for (let y = 0; y < view.height; y++) {
			const yIndex = 4 * (position.y + y) * frame.width;
			const index = 4 * (position.x + x) + yIndex;
			output[index + 0] = color.r;
			output[index + 1] = color.g;
			output[index + 2] = color.b;
			output[index + 3] = 255;
		}
	}

	return cache;
};

export type WaveformProps = {
	soundBuffer: SoundBuffer;
	soundCircularBuffer: SoundCircularBuffer;
	size: Size2D;
	isLive?: boolean;
};

export const useWaveform = (props: WaveformProps): CanvasViewProps => {
	const {
		soundBuffer, soundCircularBuffer, size, isLive,
	} = props;

	const draw = useMemo(() => {
		let cache: CacheDrawWaveform | undefined;
		return (output: Uint8ClampedArray, layout: Layout2D, colorTheme: ColorTheme) => {
			const buffer = isLive ? soundCircularBuffer.buffers[0] : soundBuffer.buffers[0];
			const cursor = isLive ? undefined : soundBuffer.cursor / (soundBuffer.memorySize - 1);
			cache = drawWaveform(buffer, output, layout, colorTheme, cache, cursor);
		};
	}, [soundBuffer, soundCircularBuffer, isLive]);

	const onClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
		if (isLive) return;
		const pos = getCanvasCursorPosition(e.currentTarget, e.nativeEvent);
		const value = Math.floor(pos.x * (soundBuffer.memorySize - 1));
		soundBuffer.setCursor(value);
	}, [soundBuffer, isLive]);

	const canvasViewProps: CanvasViewProps = {
		draw, size, onClick,
	};

	return canvasViewProps;
};
