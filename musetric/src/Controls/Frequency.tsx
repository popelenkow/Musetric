import React, { FC, useCallback, useMemo } from 'react';
import { useCssContext } from '../AppContexts/Css';
import { SoundBufferManager } from '../Sounds/SoundBufferManager';
import { viewRealArray, createRealArray } from '../TypedArray/RealArray';
import { createFftRadix4 } from '../Sounds/FftRadix4';
import { Layout2D } from '../Rendering/Layout';
import { createFrequencyColors, drawFrequency } from '../Rendering/Frequency';
import { PixelCanvas, PixelCanvasProps } from './PixelCanvas';

export type FrequencyProps = {
	soundBufferManager: SoundBufferManager;
	isLive?: boolean;
	layout: Layout2D;
};
export const Frequency: FC<FrequencyProps> = (props) => {
	const {
		soundBufferManager, isLive, layout,
	} = props;
	const { css } = useCssContext();
	const colors = useMemo(() => createFrequencyColors(css.theme), [css.theme]);

	const info = useMemo(() => {
		const windowSize = layout.size.width * 2;
		const fft = createFftRadix4(windowSize);
		const result = createRealArray('float32', layout.size.width);
		return { windowSize, fft, result };
	}, [layout]);

	const draw = useCallback((output: ImageData) => {
		const { windowSize, fft, result } = info;
		const { soundBuffer, soundCircularBuffer, cursor } = soundBufferManager;

		const getBuffer = () => {
			const cursorValue = isLive ? soundCircularBuffer.length : cursor.get();
			const buf = isLive ? soundCircularBuffer : soundBuffer;
			return { ...buf, cursorValue };
		};
		const { cursorValue, length, buffers } = getBuffer();
		let offset = cursorValue < length ? cursorValue - windowSize : length - windowSize;
		offset = offset < 0 ? 0 : offset;
		const { type, realRaw } = buffers[0];
		const view = viewRealArray(type, realRaw, Math.floor(offset), windowSize);
		fft.frequency(view, result, {});
		drawFrequency(result, output.data, layout.size, colors);
	}, [soundBufferManager, isLive, info, colors, layout]);

	const canvasProps: PixelCanvasProps = {
		layout,
		onDraw: draw,
	};

	return <PixelCanvas {...canvasProps} />;
};
