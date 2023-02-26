import React, { useCallback } from 'react';
import { NumberField, NumberFieldProps } from '../../../Controls/NumberField';
import { NumberRange } from '../../../Rendering/Layout';
import { SFC } from '../../../UtilityTypes/React';
import { SoundWorkshopSnapshot, useSoundWorkshopStore } from '../../SoundWorkshopContext';

const select = ({
	soundParameters, setSoundParameters,
}: SoundWorkshopSnapshot) => ({
	soundParameters, setSoundParameters,
} as const);

export const FrequencyRangeParameter: SFC = () => {
	const store = useSoundWorkshopStore(select);

	const {
		soundParameters,
		setSoundParameters,
	} = store;

	const { frequencyRange, sampleRate } = soundParameters;

	const setFrequencyRange = useCallback((value: NumberRange) => (
		setSoundParameters({
			frequencyRange: value,
		})
	), [setSoundParameters]);

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

	return (
		<>
			<NumberField {...frequencyToProps} />
			<NumberField {...frequencyFromProps} />
		</>
	);
};
