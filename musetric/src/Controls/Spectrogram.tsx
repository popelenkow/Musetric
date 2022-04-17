import React, { FC, useMemo, useCallback, useEffect, useState } from 'react';
import { useCssContext } from '../AppContexts/Css';
import { useWorkerContext } from '../AppContexts/Worker';
import { SoundBufferEvent } from '../Sounds/SoundBufferManager';
import { createSpectrum, SpectrumBufferEvent } from '../SoundProcessing';
import { Layout2D, Position2D } from '../Rendering/Layout';
import { createSpectrogramColors, drawSpectrogram } from '../Rendering/Spectrogram';
import { RealArray, SharedRealArray } from '../TypedArray/RealArray';
import { viewRealArrays } from '../TypedArray/RealArrays';
import { PixelCanvas, PixelCanvasProps } from './PixelCanvas';
import type { SoundParameters } from '../Workshop/SoundParameters';
import { skipPromise } from '../Utils/SkipPromise';
import { EventEmitterCallback, EventEmitterUnsubscribe } from '../Utils/EventEmitter';

export type SpectrogramProps = {
	getBuffer: () => SharedRealArray<'float32'>;
	getCursor: () => number | undefined;
	setCursor: (newCursor: number) => void;
	// eslint-disable-next-line max-len
	subscribeBufferEvents: (callback: EventEmitterCallback<SoundBufferEvent>) => EventEmitterUnsubscribe;
	soundParameters: SoundParameters;
	layout: Layout2D;
};
export const Spectrogram: FC<SpectrogramProps> = (props) => {
	const { getBuffer, getCursor, setCursor, subscribeBufferEvents, soundParameters, layout } = props;
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
		skipPromise(spectrum.start());
		return () => skipPromise(spectrum.stop());
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
		skipPromise(run());
	}, [spectrum, windowSize, count]);

	useEffect(() => {
		skipPromise(spectrum.emitBufferEvent({ type: 'newBuffer', buffer: getBuffer().realRaw }));
		const unsubscribe = subscribeBufferEvents(async (event) => {
			const createBufferEvent = (): SpectrumBufferEvent | undefined => {
				if (event.type === 'newBuffer') {
					return { type: 'newBuffer', buffer: getBuffer().realRaw };
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
		return unsubscribe;
	}, [subscribeBufferEvents, getBuffer, spectrum]);

	const onClick = useCallback((cursorPosition: Position2D) => {
		setCursor(cursorPosition.y);
	}, [setCursor]);

	const draw = useCallback((output: ImageData) => {
		if (!frequencies) return;
		const cursor = getCursor();
		drawSpectrogram({
			input: frequencies,
			output: output.data,
			frame: layout.size,
			colors,
			soundParameters,
			cursor,
		});
	}, [getCursor, soundParameters, frequencies, colors, layout]);

	const canvasProps: PixelCanvasProps = {
		layout,
		onClick,
		draw,
	};

	return <PixelCanvas {...canvasProps} />;
};
