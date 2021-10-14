import { useMemo, useCallback } from 'react';
import { useCssContext } from '../AppContexts/Css';
import { SoundBuffer } from '../Sounds/SoundBuffer';
import { SoundCircularBuffer } from '../Sounds/SoundCircularBuffer';
import { Size2D, Position2D } from '../Rendering/Layout';
import { Waves, drawWaveform, createWaveformColors, evalWaves } from '../Rendering/Waveform';
import { usePixelCanvas } from './PixelCanvas';
import { useAnimation } from '../Hooks/Animation';

export type WaveformProps = {
	soundBuffer: SoundBuffer;
	soundCircularBuffer: SoundCircularBuffer;
	isLive?: boolean;
	size: Size2D;
	pause?: boolean;
};
export type Waveform = {
	image: HTMLCanvasElement;
	onClick: (cursorPosition: Position2D) => void;
};
export const useWaveform = (props: WaveformProps): Waveform => {
	const {
		soundBuffer, soundCircularBuffer, isLive, size, pause,
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
	const draw = useCallback((output: Uint8ClampedArray, frame: Size2D) => {
		const buffer = isLive ? soundCircularBuffer.buffers[0] : soundBuffer.buffers[0];
		const cursor = isLive ? undefined : soundBuffer.cursor.get() / (soundBuffer.length - 1);
		const waves = getWaves(frame);
		evalWaves(buffer.real, waves, frame);
		drawWaveform(waves, output, frame, colors, cursor);
	}, [soundBuffer, soundCircularBuffer, isLive, colors, getWaves]);

	const onClick = useCallback((cursorPosition: Position2D) => {
		if (isLive) return;
		const value = Math.floor(cursorPosition.y * (soundBuffer.length - 1));
		soundBuffer.cursor.set(value, 'user');
	}, [soundBuffer, isLive]);

	const pixelCanvas = usePixelCanvas({ size });

	useAnimation(() => {
		if (pause) return;
		draw(pixelCanvas.image.data, pixelCanvas.size);
		pixelCanvas.context.putImageData(pixelCanvas.image, 0, 0);
	}, [draw, pixelCanvas, pause]);

	return {
		image: pixelCanvas.canvas, onClick,
	};
};
