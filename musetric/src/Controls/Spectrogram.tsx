import React, { FC, useMemo, useCallback, useEffect, useState } from 'react';
import { useCssContext, useWorkerContext } from '../AppContexts';
import { SoundBufferEvent } from '../Sounds';
import { createSpectrum, SpectrumBufferEvent } from '../SoundProcessing';
import { Position2D, createSpectrogramColors, drawSpectrogram, NumberRange, Layout2D } from '../Rendering';
import { RealArray, SharedRealArray, viewRealArrays } from '../TypedArray';
import { PixelCanvas, PixelCanvasProps } from './PixelCanvas';
import { skipPromise, EventEmitterCallback, UnsubscribeEventEmitter } from '../Utils';

export type SpectrogramProps = {
	getBuffer: () => SharedRealArray<'float32'>;
	getCursor: () => number | undefined;
	setCursor: (newCursor: number) => void;
	// eslint-disable-next-line max-len
	subscribeBufferEvents: (callback: EventEmitterCallback<SoundBufferEvent>) => UnsubscribeEventEmitter;
	frequencyRange: NumberRange;
	sampleRate: number;
	layout: Layout2D;
};
export const Spectrogram: FC<SpectrogramProps> = (props) => {
	const {
		getBuffer, getCursor, setCursor, subscribeBufferEvents,
		frequencyRange, sampleRate, layout,
	} = props;
	const { theme } = useCssContext().css;
	const colors = useMemo(() => createSpectrogramColors(theme), [theme]);
	const { spectrumUrl } = useWorkerContext();

	const windowSize = useMemo(() => 4096, []);
	const spectrum = useMemo(() => createSpectrum(spectrumUrl), [spectrumUrl]);

	useEffect(() => {
		skipPromise(spectrum.start());
		const destroy = async () => {
			await spectrum.stop();
			spectrum.destroy();
		};
		return () => skipPromise(destroy());
	}, [spectrum]);

	const count = useMemo(() => layout.size.height, [layout]);
	const [frequencies, setFrequencies] = useState<RealArray<'uint8'>[]>();
	useEffect(() => {
		const setup = async () => {
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
		skipPromise(setup());
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
			frequencyRange,
			sampleRate,
			cursor,
		});
	}, [getCursor, frequencies, colors, frequencyRange, sampleRate, layout]);

	const canvasProps: PixelCanvasProps = {
		layout,
		onClick,
		draw,
	};

	return <PixelCanvas {...canvasProps} />;
};
