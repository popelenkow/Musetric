import className from 'classnames';
import React, { useMemo, useState } from 'react';
import { createUseClasses, createClasses } from '../../AppContexts';
import { getFieldClasses } from '../../Controls';
import { useAnimation } from '../../ReactUtils';
import { SoundBufferManager } from '../../Sounds';
import { SFC } from '../../UtilityTypes';

export const getSoundProgressClasses = createClasses((css) => {
	const fieldClasses = getFieldClasses(css);
	return {
		root: {
			...fieldClasses.root,
			width: 'auto',
			height: '42px',
			position: 'relative',
		},
	};
});
const useClasses = createUseClasses('SoundProgress', getSoundProgressClasses);

export type SoundProgressProps = {
	soundBufferManager: SoundBufferManager,
	classNames?: {
		root?: string,
	},
};
export const SoundProgress: SFC<SoundProgressProps> = (props) => {
	const { soundBufferManager, classNames } = props;
	const classes = useClasses();

	const rootName = className({
		[classNames?.root || classes.root]: true,
	});

	type State = {
		cursor: number,
		length: number,
		sampleRate: number,
	};

	const [state, setState] = useState<State>({ cursor: 0, length: 0, sampleRate: 1 });

	const cursorString = useMemo(() => {
		const { cursor, sampleRate } = state;
		const value = cursor / sampleRate;
		const cursorValue = new Date(value * 1000);
		return cursorValue.toISOString().substring(14, 19);
	}, [state]);

	const memorySizeString = useMemo(() => {
		const { length, sampleRate } = state;
		const value = length / sampleRate;
		const cursorValue = new Date(value * 1000);
		return cursorValue.toISOString().substring(14, 19);
	}, [state]);

	useAnimation(() => {
		const { soundBuffer, cursor } = soundBufferManager;
		const newState = {
			cursor: cursor.get(),
			length: soundBuffer.length,
			sampleRate: soundBuffer.sampleRate,
		};
		const isEqual = (): boolean => {
			if (state.cursor !== newState.cursor) return false;
			if (state.length !== newState.length) return false;
			if (state.sampleRate !== newState.sampleRate) return false;
			return true;
		};
		if (!isEqual()) {
			setState(newState);
		}
	}, [soundBufferManager, state]);

	return (
		<div className={rootName}>
			{`${cursorString} / ${memorySizeString}`}
		</div>
	);
};
SoundProgress.displayName = 'SoundProgress';
