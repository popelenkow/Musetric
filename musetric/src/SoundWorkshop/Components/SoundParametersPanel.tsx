import React, { useEffect, useCallback } from 'react';
import { createUseClasses, createClasses } from '../../AppContexts/Css';
import { useRootElementContext } from '../../AppContexts/RootElement';
import { NumberField, NumberFieldProps } from '../../Controls/NumberField';
import { ScrollArea } from '../../Controls/ScrollArea';
import { TextField, TextFieldProps } from '../../Controls/TextField';
import { NumberRange } from '../../Rendering';
import { SFC } from '../../UtilityTypes';
import { SoundWorkshopStore, useSoundWorkshopStore } from '../Store';

export const getSoundParametersClasses = createClasses((css) => {
	const { theme } = css;
	return {
		root: {
			background: theme.activeBackground,
			'box-sizing': 'border-box',
			'border-top': `1px solid ${theme.divider}`,
			height: '100%',
			width: '100%',
		},
		list: {
			padding: '15px',
			display: 'flex',
			'flex-direction': 'column',
			'row-gap': '15px',
		},
	};
});
const useClasses = createUseClasses('SoundParameters', getSoundParametersClasses);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const select = (store: SoundWorkshopStore) => {
	const { soundParameters, setSoundParameters } = store;
	return {
		soundParameters, setSoundParameters,
	};
};

type UnsubscribeInput = () => void;
const subscribeInput = (
	rootElement: HTMLElement,
	sampleRate: number,
	frequencyRange: NumberRange,
	setFrequencyRange: (value: NumberRange) => void,
): UnsubscribeInput | undefined => {
	if (!rootElement) return undefined;
	const addTo = (value: number, delta: number, min: number, max: number): number => {
		const newValue = value + delta;
		if (newValue < min) return min;
		if (newValue > max) return max;
		return newValue;
	};
	const wheelListener = (event: WheelEvent): void => {
		const delta = event.deltaY;
		if (event.shiftKey) {
			event.preventDefault();
			const to = addTo(frequencyRange.to, delta, 1, sampleRate / 2);
			setFrequencyRange({ from: frequencyRange.from, to });
		}
	};
	rootElement.addEventListener('wheel', wheelListener);
	return () => {
		rootElement.removeEventListener('wheel', wheelListener);
	};
};
export const SoundParametersPanel: SFC = () => {
	const store = useSoundWorkshopStore(select);

	const {
		soundParameters,
		setSoundParameters,
	} = store;

	const classes = useClasses();

	const { frequencyRange, sampleRate } = soundParameters;

	const setFrequencyRange = useCallback((value: NumberRange) => (
		setSoundParameters({
			frequencyRange: value,
		})
	), [setSoundParameters]);

	const { rootElement } = useRootElementContext();
	useEffect(() => {
		return subscribeInput(rootElement, sampleRate, frequencyRange, setFrequencyRange);
	}, [rootElement, sampleRate, frequencyRange, setFrequencyRange]);

	const setFrequencyTo = useCallback((value: number) => {
		const { from } = frequencyRange;
		const getTo = (): number => {
			if (value > sampleRate / 2) return sampleRate / 2;
			if (value < from + 1) return from + 1;
			return value;
		};
		const to = getTo();
		setFrequencyRange({ from, to });
		return to;
	}, [frequencyRange, sampleRate, setFrequencyRange]);
	const setFrequencyFrom = useCallback((value: number) => {
		const { to } = frequencyRange;
		const getFrom = (): number => {
			if (value < 0) return 0;
			if (value > to - 1) return to - 1;
			return value;
		};
		const from = getFrom();
		setFrequencyRange({ from, to });
		return from;
	}, [frequencyRange, setFrequencyRange]);

	const frequencyToProps: NumberFieldProps = {
		value: frequencyRange.to,
		setValue: setFrequencyTo,
		label: 'Frequency to',
		rounded: true,
	};
	const frequencyFromProps: NumberFieldProps = {
		value: frequencyRange.from,
		setValue: setFrequencyFrom,
		label: 'Frequency from',
		rounded: true,
	};
	const textFieldProps: TextFieldProps = {
		value: 'qwe',
		label: 'text',
		rounded: true,
	};
	return (
		<div className={classes.root}>
			<ScrollArea>
				<div className={classes.list}>
					<NumberField {...frequencyToProps} />
					<NumberField {...frequencyFromProps} />
					<TextField {...textFieldProps} />
					<TextField {...textFieldProps} />
					<TextField {...textFieldProps} />
					<TextField {...textFieldProps} />
					<TextField {...textFieldProps} />
					<TextField {...textFieldProps} />
					<TextField {...textFieldProps} />
				</div>
			</ScrollArea>
		</div>
	);
};
