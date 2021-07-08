import { useMemo, useCallback } from 'react';
import {
	Theme, parseThemeUint32Color,
	Size2D, Position2D,
	SoundBuffer, SoundCircularBuffer,
} from '..';

export type AnalyzeWaveformResult = {
	minArray: Float32Array;
	maxArray: Float32Array;
};

export const analyzeWaveform = (
	input: Float32Array,
	output: AnalyzeWaveformResult,
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

export const drawWaveform = (
	input: AnalyzeWaveformResult,
	output: Uint8ClampedArray,
	frame: Size2D,
	theme: Theme,
	cursor?: number,
): void => {
	const { content, background, active } = parseThemeUint32Color(theme);
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
};

export const useWaveform = (props: WaveformProps) => {
	const {
		soundBuffer, soundCircularBuffer, isLive,
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
		return (output: Uint8ClampedArray, frame: Size2D, theme: Theme) => {
			const buffer = isLive ? soundCircularBuffer.buffers[0] : soundBuffer.buffers[0];
			const cursor = isLive ? undefined : soundBuffer.cursor / (soundBuffer.memorySize - 1);
			const analysis = getAnalysis(frame);
			analyzeWaveform(buffer, analysis, frame);
			drawWaveform(analysis, output, frame, theme, cursor);
		};
	}, [soundBuffer, soundCircularBuffer, isLive]);

	const onClick = useCallback((cursorPosition: Position2D) => {
		if (isLive) return;
		const value = Math.floor(cursorPosition.y * (soundBuffer.memorySize - 1));
		soundBuffer.setCursor(value);
	}, [soundBuffer, isLive]);

	return {
		draw, onClick,
	};
};
