import React, { FC, useCallback, useRef, useState } from 'react';
import { createUseClasses, createClasses, className } from '../AppContexts/Css';
import { useAnimation } from '../Hooks/Animation';
import { parseColor } from '../Rendering/Color';
import { getTextFieldClasses } from './TextField';
import { GroovedWheel, GroovedWheelProps } from './GroovedWheel';

export const getNumberFieldClasses = createClasses((css) => {
	const { theme, platform } = css;
	const textFieldClasses = getTextFieldClasses(css);
	return {
		root: {
			...textFieldClasses.root,
			[platform.platformId === 'mobile' ? '&:active > fieldset' : '&:hover > fieldset']: {
				'border-color': theme.activeContent,
				'border-bottom-color': 'transparent',
			},
		},
		input: {
			...textFieldClasses.input,
			'&:focus-visible + fieldset': {
				...textFieldClasses.input['&:focus-visible + fieldset'],
				'border-bottom-color': 'transparent',
			},
		},
		fieldset: {
			...textFieldClasses.fieldset,
			'border-bottom-color': 'transparent',
			'&.active': {
				...textFieldClasses.fieldset['&.active'],
				'border-bottom-color': 'transparent',
			},
		},
		legend: {
			...textFieldClasses.legend,
		},
		groovedWheel: {
			position: 'absolute',
			cursor: 'ew-resize',
			bottom: '6px',
			height: '8px',
			left: '14px',
			right: '14px',
		},
	};
});
const useClasses = createUseClasses('NumberField', getNumberFieldClasses);

export type NumberFieldProps = {
	value: number;
	onValue: (value: number) => number;
	label?: string;
	disabled?: boolean;
	rounded?: boolean;
};
export const NumberField: FC<NumberFieldProps> = (props) => {
	const {
		value, onValue, label,
		disabled, rounded,
	} = props;

	const classes = useClasses();

	const valueRef = useRef(value);
	const [active, setActive] = useState<boolean>(false);
	const [localValue, setLocalValue] = useState<string>(`${value}`);
	useAnimation(() => {
		if (!active) return;
		const result = onValue(Math.round(valueRef.current * 1e1) / 1e1);
		setLocalValue(`${result}`);
		valueRef.current = result;
	}, [active, onValue]);

	const [groovedWheelColor, setGroovedWheelColor] = useState<number>(0);
	const fieldsetRef = useRef<HTMLFieldSetElement>(null);
	useAnimation(() => {
		if (!fieldsetRef.current) return;
		const fieldsetStyles = window.getComputedStyle(fieldsetRef.current);
		const color = parseColor('uint32', fieldsetStyles.borderRightColor);
		setGroovedWheelColor(color);
	}, []);

	const stopGroovedWheelRef = useRef<() => void>(null);
	const fieldsetName = className(
		classes.fieldset,
		{ value: { active, disabled, rounded } },
	);

	const onMove = useCallback((delta: number) => {
		valueRef.current += delta;
	}, []);

	const inputProps: JSX.IntrinsicElements['input'] = {
		className: classes.input,
		type: 'text',
		value: localValue,
		onFocus: () => {
			const stopGroovedWheel = stopGroovedWheelRef.current;
			if (stopGroovedWheel) stopGroovedWheel();
		},
		onBlur: () => {
			const newValue = onValue(Number.parseFloat(localValue));
			setLocalValue(`${newValue}`);
			valueRef.current = newValue;
		},
		onChange: (event) => {
			setLocalValue(event.target.value);
		},
	};

	const groovedWheelProps: GroovedWheelProps = {
		onMove,
		onActive: setActive,
		stopRef: stopGroovedWheelRef,
		contentColor: groovedWheelColor,
	};
	return (
		<div className={classes.root}>
			<input {...inputProps} />
			<fieldset className={fieldsetName} ref={fieldsetRef}>
				<legend className={classes.legend}>{label}</legend>
			</fieldset>
			<div className={classes.groovedWheel}>
				<GroovedWheel {...groovedWheelProps} />
			</div>
		</div>
	);
};