import { useEffect, useCallback } from 'react';
import { useRootElementContext } from '../../AppContexts/RootElement';
import { NumberRange } from '../../Rendering';
import { SFC } from '../../UtilityTypes';
import { SoundWorkshopStore, useSoundWorkshopStore } from '../Store';

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
export const KeyboardSubscription: SFC<object, 'none', 'optional'> = () => {
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

	const { rootElement } = useRootElementContext();
	useEffect(() => {
		return subscribeInput(rootElement, sampleRate, frequencyRange, setFrequencyRange);
	}, [rootElement, sampleRate, frequencyRange, setFrequencyRange]);

	return null;
};