import { useMemo, useCallback, useEffect, useState } from 'react';
import { useCssContext } from '../AppContexts/Css';
import { useWorkerContext } from '../AppContexts/Worker';
import { SoundBuffer } from '../Sounds/SoundBuffer';
import { SoundCircularBuffer } from '../Sounds/SoundCircularBuffer';
import { createFrequenciesView, createSpectrum } from '../SoundProcessing';
import { Size2D, Position2D } from '../Rendering/Layout';
import { createSpectrogramColors, drawSpectrogram } from '../Rendering/Spectrogram';
import { usePixelCanvas } from './PixelCanvas';
import { useAnimation } from '../Hooks/Animation';
import { RealArray } from '../Typed/RealArray';

export type SpectrogramProps = {
	soundBuffer: SoundBuffer;
	soundCircularBuffer: SoundCircularBuffer;
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
		soundBuffer, soundCircularBuffer, isLive, size, pause,
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

	const count = useMemo(() => 128, []);
	const [frequencies, setFrequencies] = useState<RealArray<'uint8'>[]>();
	useEffect(() => {
		const run = async () => {
			const raw = await spectrum.setup({ windowSize, count });
			const result = createFrequenciesView(raw, windowSize, count);
			setFrequencies(result);
		};
		run().finally(() => { });
	}, [spectrum, windowSize, count]);

	const [buffer, setBuffer] = useState<SharedArrayBuffer>();

	useAnimation(() => {
		if (pause) return;
		const buf = isLive ? soundCircularBuffer.buffers[0].realRaw : soundBuffer.buffers[0].realRaw;
		if (buf !== buffer) {
			setBuffer(buf);
		}
	}, [
		pause, buffer, soundBuffer, soundCircularBuffer, isLive,
	]);

	useEffect(() => {
		if (!buffer) return;
		spectrum.setSoundBuffer(buffer).finally(() => { });
	}, [spectrum, buffer]);

	const onClick = useCallback((cursorPosition: Position2D) => {
		if (isLive) return;
		const value = Math.round(cursorPosition.y * (soundBuffer.length - 1));
		soundBuffer.cursor.set(value, 'user');
	}, [soundBuffer, isLive]);

	const pixelCanvas = usePixelCanvas({ size });

	useAnimation(() => {
		if (pause) return;
		if (!frequencies) return;
		const cursor = isLive ? undefined : soundBuffer.cursor.get() / (soundBuffer.length - 1);
		drawSpectrogram(frequencies, pixelCanvas.image.data, size, colors, cursor);
		pixelCanvas.context.putImageData(pixelCanvas.image, 0, 0);
	}, [
		soundBuffer, frequencies,
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
