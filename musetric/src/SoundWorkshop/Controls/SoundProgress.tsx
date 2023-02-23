import React, { useRef } from 'react';
import { createUseClasses, createClasses } from '../../AppContexts';
import { getFieldClasses } from '../../Controls';
import { useAnimationCallback } from '../../ReactUtils';
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

	type State = {
		cursor: number,
		length: number,
		sampleRate: number,
	};

	const cursorRef = useRef<HTMLDivElement>(null);
	const memorySizeRef = useRef<HTMLDivElement>(null);
	const stateRef = useRef<State>({ cursor: 0, length: 0, sampleRate: 1 });

	useAnimationCallback(() => {
		const { soundBuffer } = soundBufferManager;
		const newState: State = {
			cursor: soundBufferManager.cursor.get(),
			length: soundBuffer.length,
			sampleRate: soundBuffer.sampleRate,
		};
		stateRef.current = newState;
		const {
			cursor,
			length,
			sampleRate,
		} = newState;

		const getCursorString = (): string => {
			const value = cursor / sampleRate;
			const cursorValue = new Date(value * 1000);
			return cursorValue.toISOString().substring(14, 19);
		};

		const getMemorySize = (): string => {
			const value = length / sampleRate;
			const cursorValue = new Date(value * 1000);
			return cursorValue.toISOString().substring(14, 19);
		};
		if (!cursorRef.current || !memorySizeRef.current) return;
		cursorRef.current.textContent = getCursorString();
		memorySizeRef.current.textContent = getMemorySize();
	});

	return (
		<div className={classNames?.root || classes.root}>
			<div ref={cursorRef} />
			<div>
				{' / '}
			</div>
			<div ref={memorySizeRef} />
		</div>
	);
};
