import React, { useEffect, useState, ReactElement, useCallback } from 'react';
import className from 'classnames';
import { createUseClasses, createClasses } from '../AppContexts/Css';
import { useIconContext } from '../AppContexts/Icon';
import { SoundBufferManager } from '../Sounds/SoundBufferManager';
import { useLocaleContext } from '../AppContexts/Locale';
import { Button, ButtonProps } from '../Controls/Button';
import { NumberField, NumberFieldProps } from '../Controls/NumberField';
import { TextField, TextFieldProps } from '../Controls/TextField';
import { ScrollArea } from '../Controls/ScrollArea';
import { useRootElementContext } from '../AppContexts/RootElement';

export const getSoundParametersClasses = createClasses((css) => {
	const { theme } = css;
	return {
		root: {
			'grid-area': 'parameters',
			background: theme.activeBackground,
			'box-sizing': 'border-box',
			'border-bottom': `1px solid ${theme.divider}`,
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

export type Range = {
	from: number;
	to: number;
};
export type UseSoundParametersOptions = {
	sampleRate: SoundBufferManager;
};
export type SoundParameters = {
	rangeX: Range;
	frequencyRange: Range;
	sampleRate: number;
	isOpenParameters: boolean;
	renderParametersButton: () => ReactElement;
	renderParametersPanel: () => ReactElement;
};
export const useSoundParameters = (sampleRate: number): SoundParameters => {
	const classes = useClasses();
	const { i18n } = useLocaleContext();
	const { ParametersIcon } = useIconContext();

	const [rangeX, setRangeX] = useState<Range>({ from: 0, to: sampleRate / 2 / 6 });
	const [frequencyRange, setFrequencyRange] = useState<Range>({ from: 0, to: sampleRate / 2 / 6 });
	const { rootElement } = useRootElementContext();
	useEffect(() => {
		if (!rootElement) return undefined;
		const addTo = (value: number, delta: number, min: number, max: number) => {
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
				return;
			}
			if (event.ctrlKey) {
				event.preventDefault();
				const to = addTo(rangeX.to, delta, 1, sampleRate / 2);
				setRangeX({ from: rangeX.from, to });
			}
		};
		rootElement.addEventListener('wheel', wheelListener);
		return () => {
			rootElement.removeEventListener('wheel', wheelListener);
		};
	}, [rootElement, sampleRate, rangeX, frequencyRange]);

	const [isOpenParameters, setIsOpenParameters] = useState<boolean>(false);

	const renderParametersButton = () => {
		const openProps: ButtonProps = {
			kind: 'icon',
			rounded: true,
			title: i18n.t('Workshop:parameters'),
			active: isOpenParameters,
			onClick: () => setIsOpenParameters(!isOpenParameters),
		};
		return (
			<Button {...openProps}>
				<ParametersIcon />
			</Button>
		);
	};
	const setFrequencyTo = useCallback((value: number) => {
		const { from } = frequencyRange;
		const getTo = () => {
			if (value > sampleRate / 2) return sampleRate / 2;
			if (value < from + 1) return from + 1;
			return value;
		};
		const to = getTo();
		setFrequencyRange({ from, to });
		return to;
	}, [frequencyRange, sampleRate]);
	const setFrequencyFrom = useCallback((value: number) => {
		const { to } = frequencyRange;
		const getFrom = () => {
			if (value < 0) return 0;
			if (value > to - 1) return to - 1;
			return value;
		};
		const from = getFrom();
		setFrequencyRange({ from, to });
		return from;
	}, [frequencyRange]);
	const renderParametersPanel = () => {
		const rootName = className({
			[classes.root]: true,
		});
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
			<div className={rootName}>
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

	return {
		rangeX,
		frequencyRange,
		sampleRate,
		isOpenParameters,
		renderParametersButton,
		renderParametersPanel,
	};
};
