import React, { useMemo, useCallback } from 'react';
import {
	ColorTheme, parseThemeUint32Color,
	Layout2D, Size2D, getCanvasCursorPosition,
	SoundBuffer, SoundCircularBuffer,
	CanvasViewProps,
} from '..';

export type AnalyzeWaveformResult = {
	minArray: Float32Array;
	maxArray: Float32Array;
};

export const analyzeWaveform = (
	input: Float32Array,
	output: AnalyzeWaveformResult,
	layout: Layout2D,
) => {
	const { view } = layout;
	const { minArray, maxArray } = output;
	const step = input.length / view.height;
	for (let y = 0; y < view.height; y++) {
		let min = 1.0;
		let max = -1.0;
		const offset = Math.floor(y * step);
		for (let i = 0; i < step; i++) {
			const value = input[offset + i];
			if (value < min) min = value;
			if (value > max) max = value;
		}
		minArray[y] = min;
		maxArray[y] = max;
	}

	for (let y = 0; y < view.height; y++) {
		minArray[y] = (1 + minArray[y]) * (view.width / 2);
		maxArray[y] = (1 + maxArray[y]) * (view.width / 2);
	}
};

export const drawWaveform = (
	input: AnalyzeWaveformResult,
	output: Uint8ClampedArray,
	layout: Layout2D,
	colorTheme: ColorTheme,
	cursor?: number,
): void => {
	const { position, view, frame } = layout;
	const { content, background, active } = parseThemeUint32Color(colorTheme);
	const { minArray, maxArray } = input;
	const out = new Uint32Array(output.buffer);

	for (let y = 0; y < view.height; y++) {
		const min = Math.ceil(minArray[y]);
		const max = Math.ceil(maxArray[y]);
		const yIndex = (position.y + y) * frame.width;
		const index = position.x + yIndex;
		out.fill(background, index, index + min);
		out.fill(content, index + min, index + max);
		out.fill(background, index + max, index + view.width);
	}

	if (typeof cursor === 'number') {
		const y = Math.round(cursor * (view.height - 1));
		const yIndex = (position.y + y) * frame.width;
		const index = position.x + yIndex;
		out.fill(active, index, index + view.width);
	}
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
		let analysisState: AnalyzeWaveformResult | undefined;
		const getAnalysis = (view: Size2D) => {
			if (!analysisState || (analysisState.minArray.length !== view.height)) {
				analysisState = {
					minArray: new Float32Array(view.height),
					maxArray: new Float32Array(view.height),
				};
			}
			return analysisState;
		};
		return (output: Uint8ClampedArray, layout: Layout2D, colorTheme: ColorTheme) => {
			const buffer = isLive ? soundCircularBuffer.buffers[0] : soundBuffer.buffers[0];
			const cursor = isLive ? undefined : soundBuffer.cursor / (soundBuffer.memorySize - 1);
			const analysis = getAnalysis(layout.view);
			analyzeWaveform(buffer, analysis, layout);
			drawWaveform(analysis, output, layout, colorTheme, cursor);
		};
	}, [soundBuffer, soundCircularBuffer, isLive]);

	const onClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
		if (isLive) return;
		const pos = getCanvasCursorPosition(e.currentTarget, e.nativeEvent);
		const value = Math.floor(pos.y * (soundBuffer.memorySize - 1));
		soundBuffer.setCursor(value);
	}, [soundBuffer, isLive]);

	const canvasViewProps: CanvasViewProps = {
		draw, size, onClick,
	};

	return canvasViewProps;
};
