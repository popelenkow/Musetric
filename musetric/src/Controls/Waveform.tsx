import React, { useMemo, useCallback, useRef } from 'react';
import { createUseClasses, useAppCss } from '../App/AppCss';
import { themeVariables } from '../AppBase/Theme';
import { Layout2D, Size2D, Position2D } from '../Rendering/Layout';
import { Waves, drawWaveform, createWaveformColors, evalWaves } from '../Rendering/Waveform';
import { SharedRealArray } from '../TypedArray/RealArray';
import { SFC } from '../UtilityTypes/React';
import { PixelCanvas, PixelCanvasProps } from './PixelCanvas';

const useClasses = createUseClasses('Waveform', {
	root: {
		width: '100%',
		height: '100%',
		position: 'relative',
	},
	cursor: {
		height: '100%',
		'border-left': `1px solid var(${themeVariables.primary})`,
		position: 'absolute',
		'pointer-events': 'none',
	},
});

export type WaveformProps = {
	getBuffer: () => SharedRealArray<'float32'>,
	getCursor: () => number | undefined,
	setCursor: (newCursor: number) => void,
	layout: Layout2D,
};
export const Waveform: SFC<WaveformProps> = (props) => {
	const { getBuffer, getCursor, setCursor, layout } = props;

	const classes = useClasses();
	const { theme } = useAppCss();
	const colors = useMemo(() => createWaveformColors(theme), [theme]);
	const cursorRef = useRef<HTMLDivElement>(null);

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

		const buffer = getBuffer();
		const waves = getWaves(layout.size);
		evalWaves(buffer.real, waves, layout.size);
		drawWaveform(waves, output.data, layout.size, colors);
	}, [getBuffer, getCursor, colors, getWaves, layout]);

	const onClick = useCallback((cursorPosition: Position2D) => {
		setCursor?.(cursorPosition.y);
	}, [setCursor]);

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
