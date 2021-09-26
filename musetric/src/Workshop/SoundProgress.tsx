import React, { useMemo, useState, FC } from 'react';
import className from 'classnames';
import { createUseClasses, createClasses } from '../AppContexts/Css';
import { SoundBuffer } from '../Sounds/SoundBuffer';
import { useAnimation } from '../Hooks/Animation';
import { getFieldClasses } from '../Controls/Field';

export const getSoundProgressClasses = createClasses((css) => {
	const fieldClasses = getFieldClasses(css);
	return {
		root: {
			...fieldClasses.root,
			width: '118px',
			height: '42px',
			position: 'relative',
			'border-radius': '21px',
			'user-select': 'none',
		},
	};
});
const useClasses = createUseClasses('SoundProgress', getSoundProgressClasses);

export type SoundProgressProps = {
	soundBuffer: SoundBuffer;
	classNames?: {
		root?: string;
	};
};
export const SoundProgress: FC<SoundProgressProps> = (props) => {
	const { soundBuffer, classNames } = props;
	const classes = useClasses();

	const rootName = className({
		[classNames?.root || classes.root]: true,
	});

	type State = {
		cursor: number,
		length: number;
		sampleRate: number;
	};

	const [state, setState] = useState<State>({ cursor: 0, length: 0, sampleRate: 1 });

	const cursorString = useMemo(() => {
		const { cursor, sampleRate } = state;
		const value = cursor / sampleRate;
		const cursorValue = new Date(value * 1000);
		return cursorValue.toISOString().substr(14, 5);
	}, [state]);

	const memorySizeString = useMemo(() => {
		const { length, sampleRate } = state;
		const value = length / sampleRate;
		const cursorValue = new Date(value * 1000);
		return cursorValue.toISOString().substr(14, 5);
	}, [state]);

	useAnimation(() => {
		const newState = {
			cursor: soundBuffer.cursor,
			length: soundBuffer.length,
			sampleRate: soundBuffer.sampleRate,
		};
		const isEqual = () => {
			if (state.cursor !== newState.cursor) return false;
			if (state.length !== newState.length) return false;
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
