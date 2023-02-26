import React, { useRef } from 'react';
import { createUseClasses, createClasses } from '../../AppContexts/Css';
import { getFieldClasses } from '../../Controls/Field';
import { SFC } from '../../UtilityTypes/React';
import { useAnimationCallback } from '../../UtilsReact/Animation';
import { SoundWorkshopSnapshot, useSoundWorkshopStore } from '../SoundWorkshopContext';

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

const select = ({
	soundBufferManager,
}: SoundWorkshopSnapshot) => ({
	soundBufferManager,
} as const);

export const SoundProgress: SFC = () => {
	const store = useSoundWorkshopStore(select);
	const { soundBufferManager } = store;

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
		<div className={classes.root}>
			<div ref={cursorRef} />
			<div>
				{' / '}
			</div>
			<div ref={memorySizeRef} />
		</div>
	);
};
