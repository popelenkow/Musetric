import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { Theme, createUseClasses, SoundBuffer, useAnimation, getFieldClasses } from '..';

export const getSoundProgressClasses = (theme: Theme) => ({
	root: {
		...getFieldClasses(theme).root,
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
	className?: string;
};

export const SoundProgress: React.FC<SoundProgressProps> = (props) => {
	const { soundBuffer, className } = props;
	const classes = useSoundProgressClasses();

	const rootName = classNames(className || classes.root);

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
