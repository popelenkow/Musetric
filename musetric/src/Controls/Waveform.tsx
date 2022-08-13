import React, { useMemo, useCallback } from 'react';
import { useCssContext } from '../AppContexts/Css';
import { Layout2D, Size2D, Position2D } from '../Rendering/Layout';
import { Waves, drawWaveform, createWaveformColors, evalWaves } from '../Rendering/Waveform';
import { PixelCanvas, PixelCanvasProps } from './PixelCanvas';
import { SharedRealArray } from '../TypedArray';
import { SFC } from '../UtilityTypes';

export type WaveformProps = {
	getBuffer: () => SharedRealArray<'float32'>,
	getCursor: () => number | undefined,
	setCursor: (newCursor: number) => void,
	layout: Layout2D,
};
export const Waveform: SFC<WaveformProps> = (props) => {
	const { getBuffer, getCursor, setCursor, layout } = props;
	const { css } = useCssContext();
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
	const draw = useCallback((output: ImageData) => {
		const buffer = getBuffer();
		const waves = getWaves(layout.size);
		evalWaves(buffer.real, waves, layout.size);
		drawWaveform(waves, output.data, layout.size, colors, getCursor());
	}, [getBuffer, getCursor, colors, getWaves, layout]);

	const onClick = useCallback((cursorPosition: Position2D) => {
		setCursor?.(cursorPosition.y);
	}, [setCursor]);

	const canvasProps: PixelCanvasProps = {
		layout,
		onClick,
		draw,
	};

	return <PixelCanvas {...canvasProps} />;
};
Waveform.displayName = 'Waveform';
