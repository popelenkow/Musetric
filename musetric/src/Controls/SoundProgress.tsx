import React, { useMemo, useState, FC } from 'react';
import className from 'classnames';
import { createUseClasses, Css } from '../AppContexts/CssContext';
import { SoundBuffer } from '../Sounds/SoundBuffer';
import { useAnimation } from '../Rendering/Animation';
import { getFieldClasses } from './Field';

export const getSoundProgressClasses = (css: Css) => ({
	root: {
		...getFieldClasses(css).root,
		width: '118px',
		height: '42px',
		position: 'relative',
		'border-radius': '21px',
		'user-select': 'none',
	},
});

export const useSoundProgressClasses = createUseClasses('SoundProgress', getSoundProgressClasses);

export type SoundProgressProps = {
	soundBuffer: SoundBuffer;
	classNames?: {
		root?: string;
	};
};

export const SoundProgress: FC<SoundProgressProps> = (props) => {
	const { soundBuffer, classNames } = props;
	const classes = useSoundProgressClasses();

	const rootName = className({
		[classNames?.root || classes.root]: true,
	});

	type State = {
		cursor: number,
		memorySize: number;
		sampleRate: number;
	};

	const [state, setState] = useState<State>({ cursor: 0, memorySize: 0, sampleRate: 1 });

	const cursorString = useMemo(() => {
		const { cursor, sampleRate } = state;
		const value = cursor / sampleRate;
		const cursorValue = new Date(value * 1000);
		return cursorValue.toISOString().substr(14, 5);
	}, [state]);

	const memorySizeString = useMemo(() => {
		const { memorySize, sampleRate } = state;
		const value = memorySize / sampleRate;
		const cursorValue = new Date(value * 1000);
		return cursorValue.toISOString().substr(14, 5);
	}, [state]);

	useAnimation(() => {
		const newState = {
			cursor: soundBuffer.cursor,
			memorySize: soundBuffer.memorySize,
			sampleRate: soundBuffer.sampleRate,
		};
		const isEqual = () => {
			if (state.cursor !== newState.cursor) return false;
			if (state.memorySize !== newState.memorySize) return false;
			if (state.sampleRate !== newState.sampleRate) return false;
			return true;
		};
		if (!isEqual()) {
			setState(newState);
		}
	}, [soundBuffer, state]);

	return (
		<div className={rootName}>
			{`${cursorString} / ${memorySizeString}`}
		</div>
	);
};
