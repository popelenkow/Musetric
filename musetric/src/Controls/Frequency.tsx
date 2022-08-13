import React, { useCallback, useMemo } from 'react';
import { useCssContext } from '../AppContexts/Css';
import { viewRealArray, createRealArray, SharedRealArray } from '../TypedArray/RealArray';
import { createFftRadix4 } from '../Sounds/FftRadix4';
import { Layout2D } from '../Rendering/Layout';
import { createFrequencyColors, drawFrequency } from '../Rendering/Frequency';
import { PixelCanvas, PixelCanvasProps } from './PixelCanvas';
import { SFC } from '../UtilityTypes';

export type FrequencyProps = {
	getBuffer: () => SharedRealArray<'float32'>,
	getCursor: () => number | undefined,
	layout: Layout2D,
};
export const Frequency: SFC<FrequencyProps> = (props) => {
	const { getBuffer, getCursor, layout } = props;
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
		const buffer = getBuffer();
		const { length } = buffer.real;
		const cursor = (getCursor() ?? 1) * length;
		let offset = cursor < length ? cursor - windowSize : length - windowSize;
		offset = offset < 0 ? 0 : offset;
		const view = viewRealArray(buffer.type, buffer.realRaw, Math.floor(offset), windowSize);
		fft.frequency(view, result, {});
		drawFrequency(result, output.data, layout.size, colors);
	}, [getBuffer, getCursor, info, colors, layout]);

	const canvasProps: PixelCanvasProps = {
		layout,
		draw,
	};

	return <PixelCanvas {...canvasProps} />;
};
Frequency.displayName = 'Frequency';
