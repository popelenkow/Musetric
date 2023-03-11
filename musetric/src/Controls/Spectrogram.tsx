import React, { useMemo, useCallback, useEffect, useState, useRef } from 'react';
import { useAppWorkers } from '../App/AppContext';
import { createClasses, createUseClasses, useAppCss } from '../App/AppCss';
import { Position2D, NumberRange, Layout2D } from '../Rendering/Layout';
import { createSpectrogramColors, drawSpectrogram } from '../Rendering/Spectrogram';
import { createSpectrum } from '../SoundProcessing/Spectrum';
import { SpectrumBufferEvent } from '../SoundProcessing/SpectrumWorker';
import { SoundBufferEvent } from '../Sounds/SoundBufferManager';
import { RealArray, SharedRealArray } from '../TypedArray/RealArray';
import { viewRealArrays } from '../TypedArray/RealArrays';
import { SFC } from '../UtilityTypes/React';
import { EventEmitterCallback, UnsubscribeEventEmitter } from '../Utils/EventEmitter';
import { skipPromise } from '../Utils/SkipPromise';
import { PixelCanvas, PixelCanvasProps } from './PixelCanvas';

export const getSpectrogramClasses = createClasses((css) => {
	const { theme } = css;
	return {
		root: {
			width: '100%',
			height: '100%',
			position: 'relative',
		},
		cursor: {
			height: '100%',
			'border-left': `1px solid ${theme.primary}`,
			position: 'absolute',
			'pointer-events': 'none',
		},
	};
});
const useClasses = createUseClasses('Spectrogram', getSpectrogramClasses);

export type SpectrogramProps = {
	getBuffer: () => SharedRealArray<'float32'>,
	getCursor: () => number | undefined,
	setCursor: (newCursor: number) => void,
	// eslint-disable-next-line max-len
	subscribeBufferEvents: (callback: EventEmitterCallback<SoundBufferEvent>) => UnsubscribeEventEmitter,
	frequencyRange: NumberRange,
	sampleRate: number,
	layout: Layout2D,
};
export const Spectrogram: SFC<SpectrogramProps> = (props) => {
	const {
		getBuffer, getCursor, setCursor, subscribeBufferEvents,
		frequencyRange, sampleRate, layout,
	} = props;

	const classes = useClasses();
	const { theme } = useAppCss();
	const colors = useMemo(() => createSpectrogramColors(theme), [theme]);
	const { spectrumUrl } = useAppWorkers();
	const cursorRef = useRef<HTMLDivElement>(null);

	const windowSize = useMemo(() => 4096, []);
	const spectrum = useMemo(() => createSpectrum(spectrumUrl), [spectrumUrl]);

	useEffect(() => {
		skipPromise(spectrum.start());
		const destroy = async (): Promise<void> => {
			await spectrum.stop();
		};
		return () => skipPromise(destroy());
	}, [spectrum]);

	const count = useMemo(() => layout.size.height, [layout]);
	const [frequencies, setFrequencies] = useState<RealArray<'uint8'>[]>();
	useEffect(() => {
		const setup = async (): Promise<void> => {
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

	const draw = useMemo(() => {
		if (!frequencies) return undefined;
		return (output: ImageData) => {
			const cursor = getCursor();
			if (cursorRef.current) {
				if (typeof cursor === 'number') {
					cursorRef.current.hidden = false;
					cursorRef.current.style.left = `${100 * cursor}%`;
				}
				else {
					cursorRef.current.hidden = true;
				}
			}
			drawSpectrogram({
				input: frequencies,
				output: output.data,
				frame: layout.size,
				colors,
				frequencyRange,
				sampleRate,
			});
		};
	}, [getCursor, frequencies, colors, frequencyRange, sampleRate, layout]);

	const canvasProps: PixelCanvasProps = {
		layout,
		onClick,
		draw,
	};

	return (
		<div className={classes.root}>
			<div ref={cursorRef} className={classes.cursor} />
			<PixelCanvas {...canvasProps} />
		</div>
	);
};
