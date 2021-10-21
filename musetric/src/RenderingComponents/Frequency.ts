import { useMemo } from 'react';
import { useCssContext } from '../AppContexts/Css';
import { SoundBuffer } from '../Sounds/SoundBuffer';
import { SoundCircularBuffer } from '../Sounds/SoundCircularBuffer';
import { viewRealArray, createRealArray } from '../Typed/RealArray';
import { createFftRadix4 } from '../Sounds/FftRadix4';
import { Size2D } from '../Rendering/Layout';
import { createFrequencyColors, drawFrequency } from '../Rendering/Frequency';
import { useAnimation } from '../Hooks/Animation';
import { usePixelCanvas } from './PixelCanvas';

export type FrequencyProps = {
	soundBuffer: SoundBuffer;
	soundCircularBuffer: SoundCircularBuffer;
	isLive?: boolean;
	size: Size2D;
	pause?: boolean;
};
export type Frequency = {
	image: HTMLCanvasElement;
};
export const useFrequency = (props: FrequencyProps): Frequency => {
	const {
		soundBuffer, soundCircularBuffer, isLive, size, pause,
	} = props;
	const { css } = useCssContext();
	const colors = useMemo(() => createFrequencyColors(css.theme), [css.theme]);

	const info = useMemo(() => {
		const windowSize = size.width * 2;
		const fft = createFftRadix4(windowSize);
		const result = createRealArray('float32', size.width);
		return { windowSize, fft, result };
	}, [size]);

	const draw = useMemo(() => {
		return (output: Uint8ClampedArray, frame: Size2D) => {
			const { windowSize, fft, result } = info;

			const getBuffer = () => {
				const cur = isLive ? soundCircularBuffer.length : soundBuffer.cursor.get();
				const buf = isLive ? soundCircularBuffer : soundBuffer;
				return { ...buf, cursor: cur };
			};
			const { cursor, length, buffers } = getBuffer();
			let offset = cursor < length ? cursor - windowSize : length - windowSize;
			offset = offset < 0 ? 0 : offset;
			const { type, realRaw } = buffers[0];
			const view = viewRealArray(type, realRaw, Math.floor(offset), windowSize);
			fft.frequency(view, result, {});
			drawFrequency(result, output, frame, colors);
		};
	}, [soundBuffer, soundCircularBuffer, isLive, info, colors]);

	const pixelCanvas = usePixelCanvas({ size });

	useAnimation(() => {
		if (pause) return;
		draw(pixelCanvas.image.data, pixelCanvas.size);
		pixelCanvas.context.putImageData(pixelCanvas.image, 0, 0);
	}, [draw, pixelCanvas, pause]);

	return {
		image: pixelCanvas.canvas,
	};
};
