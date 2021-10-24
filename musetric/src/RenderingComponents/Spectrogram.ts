import { useMemo, useCallback, useEffect, useState } from 'react';
import { useCssContext } from '../AppContexts/Css';
import { useWorkerContext } from '../AppContexts/Worker';
import { SoundBufferManager } from '../Sounds/SoundBufferManager';
import { createSpectrum, SpectrumBufferEvent } from '../SoundProcessing';
import { Size2D, Position2D } from '../Rendering/Layout';
import { createSpectrogramColors, drawSpectrogram } from '../Rendering/Spectrogram';
import { usePixelCanvas } from './PixelCanvas';
import { useAnimation } from '../Hooks/Animation';
import { RealArray } from '../Typed/RealArray';
import { viewRealArrays } from '../Typed/RealArrays';

export type SpectrogramProps = {
	soundBufferManager: SoundBufferManager;
	isLive?: boolean;
	size: Size2D;
	pause?: boolean;
};
export type Spectrogram = {
	image: HTMLCanvasElement;
	onClick: (cursorPosition: Position2D) => void;
};
export const useSpectrogram = (props: SpectrogramProps): Spectrogram => {
	const {
		soundBufferManager, isLive, size, pause,
	} = props;
	const { theme } = useCssContext().css;
	const colors = useMemo(() => createSpectrogramColors(theme), [theme]);
	const { spectrumUrl } = useWorkerContext();

	const windowSize = useMemo(() => size.width * 2, [size]);
	const spectrum = useMemo(() => createSpectrum(spectrumUrl), [spectrumUrl]);

	useEffect(() => {
		if (pause) return undefined;
		spectrum.start().finally(() => { });
		return () => { spectrum.stop().finally(() => { }); };
	}, [spectrum, pause]);

	const count = useMemo(() => size.height, [size]);
	const [frequencies, setFrequencies] = useState<RealArray<'uint8'>[]>();
	useEffect(() => {
		const run = async () => {
			const raw = await spectrum.setup({ windowSize, count });
			const fftSize = windowSize / 2;
			const result = viewRealArrays('uint8', raw, {
				offset: 0,
				step: fftSize,
				length: fftSize,
				count,
			});
			setFrequencies(result);
		};
		run().finally(() => { });
	}, [spectrum, windowSize, count]);

	useEffect(() => {
		const { soundBuffer, soundCircularBuffer } = soundBufferManager;
		const buffer = isLive ? soundCircularBuffer : soundBuffer;
		const on = isLive ? soundBufferManager.onCircular : soundBufferManager.on;
		const unsubscribe = on.subscribe(async (event) => {
			const createBufferEvent = (): SpectrumBufferEvent | undefined => {
				if (event.type === 'newBuffer') {
					const value = buffer.buffers[0].realRaw;
					return { type: 'newBuffer', value };
				}
				if (event.type === 'invalidate') {
					const { from, to } = event;
					return { type: 'invalidate', from, to };
				}
				if (event.type === 'shift') {
					const { offset } = event;
					return { type: 'shift', offset };
				}
				return undefined;
			};
			const bufferEvent = createBufferEvent();
			if (bufferEvent) await spectrum.emitBufferEvent(bufferEvent);
		});
		spectrum.emitBufferEvent({ type: 'newBuffer', value: buffer.buffers[0].realRaw }).finally(() => {});
		return unsubscribe;
	}, [
		pause, soundBufferManager, isLive, spectrum,
	]);

	const onClick = useCallback((cursorPosition: Position2D) => {
		if (isLive) return;
		const { soundBuffer, cursor } = soundBufferManager;
		const value = Math.round(cursorPosition.y * (soundBuffer.length - 1));
		cursor.set(value, 'user');
	}, [soundBufferManager, isLive]);

	const pixelCanvas = usePixelCanvas({ size });

	useAnimation(() => {
		if (pause) return;
		if (!frequencies) return;
		const { soundBuffer, cursor } = soundBufferManager;
		const cursorValue = isLive ? undefined : cursor.get() / (soundBuffer.length - 1);
		drawSpectrogram(frequencies, pixelCanvas.image.data, size, colors, cursorValue);
		pixelCanvas.context.putImageData(pixelCanvas.image, 0, 0);
	}, [
		soundBufferManager, frequencies,
		pixelCanvas, colors,
		isLive, size, pause,
	]);

	const result = useMemo(() => {
		return {
			image: pixelCanvas.canvas, onClick,
		};
	}, [pixelCanvas.canvas, onClick]);
	return result;
};
