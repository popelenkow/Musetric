import React, { FC, useMemo, useCallback, useEffect, useState } from 'react';
import { useCssContext } from '../AppContexts/Css';
import { useWorkerContext } from '../AppContexts/Worker';
import { SoundBufferManager } from '../Sounds/SoundBufferManager';
import { createSpectrum, SpectrumBufferEvent } from '../SoundProcessing';
import { Layout2D, Position2D } from '../Rendering/Layout';
import { createSpectrogramColors, drawSpectrogram } from '../Rendering/Spectrogram';
import { RealArray } from '../TypedArray/RealArray';
import { viewRealArrays } from '../TypedArray/RealArrays';
import { PixelCanvas, PixelCanvasProps } from './PixelCanvas';
import type { SoundParameters } from '../Workshop/SoundParameters';

export type SpectrogramProps = {
	soundBufferManager: SoundBufferManager;
	soundParameters: SoundParameters;
	isLive?: boolean;
	layout: Layout2D;
};
export const Spectrogram: FC<SpectrogramProps> = (props) => {
	const {
		soundBufferManager, soundParameters, isLive, layout,
	} = props;
	const { theme } = useCssContext().css;
	const colors = useMemo(() => createSpectrogramColors(theme), [theme]);
	const { spectrumUrl } = useWorkerContext();

	const windowSize = useMemo(() => 4096, []);
	const spectrum = useMemo(() => createSpectrum(spectrumUrl), [spectrumUrl]);

	useEffect(() => {
		return () => {
			spectrum.destroy();
		};
	}, [spectrum]);

	useEffect(() => {
		spectrum.start().finally(() => { });
		return () => { spectrum.stop().finally(() => { }); };
	}, [spectrum]);

	const count = useMemo(() => layout.size.height, [layout]);
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
	}, [soundBufferManager, isLive, spectrum]);

	const onClick = useCallback((cursorPosition: Position2D) => {
		if (isLive) return;
		const { soundBuffer, cursor } = soundBufferManager;
		const value = Math.round(cursorPosition.y * (soundBuffer.length - 1));
		cursor.set(value, 'user');
	}, [soundBufferManager, isLive]);

	const draw = useCallback((output: ImageData) => {
		if (!frequencies) return;
		const { soundBuffer, cursor } = soundBufferManager;
		const cursorValue = isLive ? undefined : cursor.get() / (soundBuffer.length - 1);
		drawSpectrogram({
			input: frequencies,
			output: output.data,
			frame: layout.size,
			colors,
			soundParameters,
			cursor: cursorValue,
		});
	}, [
		soundBufferManager, soundParameters,
		frequencies, colors,
		isLive, layout,
	]);

	const canvasProps: PixelCanvasProps = {
		layout,
		onClick,
		onDraw: draw,
	};

	return <PixelCanvas {...canvasProps} />;
};
