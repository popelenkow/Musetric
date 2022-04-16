import React, { FC, useMemo, useCallback } from 'react';
import { useCssContext } from '../AppContexts/Css';
import { SoundBufferManager } from '../Sounds/SoundBufferManager';
import { Layout2D, Size2D, Position2D } from '../Rendering/Layout';
import { Waves, drawWaveform, createWaveformColors, evalWaves } from '../Rendering/Waveform';
import { PixelCanvas, PixelCanvasProps } from './PixelCanvas';

export type WaveformProps = {
	soundBufferManager: SoundBufferManager;
	isLive?: boolean;
	layout: Layout2D;
};
export const Waveform: FC<WaveformProps> = (props) => {
	const {
		soundBufferManager, isLive, layout,
	} = props;
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
		const { soundBuffer, soundCircularBuffer, cursor } = soundBufferManager;
		const buffer = isLive ? soundCircularBuffer.buffers[0] : soundBuffer.buffers[0];
		const cursorValue = isLive ? undefined : cursor.get() / (soundBuffer.length - 1);
		const waves = getWaves(layout.size);
		evalWaves(buffer.real, waves, layout.size);
		drawWaveform(waves, output.data, layout.size, colors, cursorValue);
	}, [soundBufferManager, isLive, colors, getWaves, layout]);

	const onClick = useCallback((cursorPosition: Position2D) => {
		if (isLive) return;
		const { soundBuffer, cursor } = soundBufferManager;
		const value = Math.floor(cursorPosition.y * (soundBuffer.length - 1));
		cursor.set(value, 'user');
	}, [soundBufferManager, isLive]);

	const canvasProps: PixelCanvasProps = {
		layout,
		onClick,
		draw,
	};

	return <PixelCanvas {...canvasProps} />;
};
