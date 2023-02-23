import React, { useCallback, useRef, useState } from 'react';
import { createUseClasses, createClasses, className } from '../AppContexts/Css';
import { useAnimation } from '../ReactUtils/Animation';
import { SFC } from '../UtilityTypes';
import { GroovedWheel, GroovedWheelProps } from './GroovedWheel';
import { getTextFieldClasses } from './TextField';

export const getNumberFieldClasses = createClasses((css) => {
	const { theme, platform } = css;
	const textFieldClasses = getTextFieldClasses(css);
	const rootActive = ['&.active', platform.platformId === 'mobile' ? '&:active' : '&:hover'];
	const rootActiveSelector = {
		[rootActive.map((x) => x.concat(' > fieldset')).join(', ')]: {
			'border-color': theme.activeContent,
			'border-bottom-color': 'transparent',
		},
		[rootActive.map((x) => x.concat('> .NumberField-groovedWheel > *')).join(', ')]: {
			'background-color': theme.activeContent,
		},
	};
	return {
		root: {
			...textFieldClasses.root,
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			...(rootActiveSelector as unknown as Record<string, string>),
		},
		input: {
			...textFieldClasses.input,
			'&:focus-visible + fieldset': {
				...textFieldClasses.input['&:focus-visible + fieldset'],
				'border-bottom-color': 'transparent',
			},
			'&:focus-visible ~ .NumberField-groovedWheel > *': {
				'background-color': theme.activePrimary,
			},
		},
		fieldset: {
			...textFieldClasses.fieldset,
			'border-bottom-color': 'transparent',
		},
		legend: {
			...textFieldClasses.legend,
		},
		groovedWheel: {
			position: 'absolute',
			cursor: 'ew-resize',
			bottom: '0px',
			height: '8px',
			left: '12px',
			right: '12px',
		},
	};
});
const useClasses = createUseClasses('NumberField', getNumberFieldClasses);

export type NumberFieldProps = {
	value: number,
	setValue: (value: number) => number,
	label?: string,
	disabled?: boolean,
	rounded?: boolean,
};
export const NumberField: SFC<NumberFieldProps> = (props) => {
	const {
		value, setValue, label,
		disabled, rounded,
	} = props;

	const classes = useClasses();

	const valueRef = useRef(value);
	const [active, setActive] = useState<boolean>(false);
	const [localValue, setLocalValue] = useState<string>(`${value}`);
	useAnimation(() => {
		if (!active) return undefined;
		return () => {
			const result = setValue(Math.round(valueRef.current * 1e1) / 1e1);
			setLocalValue(`${result}`);
			valueRef.current = result;
		};
	});

	const stopGroovedWheelRef = useRef<() => void>(null);
	const rootName = className(
		classes.root,
		{ active },
	);
	const fieldsetName = className(
		classes.fieldset,
		{ disabled, rounded },
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
			const newValue = setValue(Number.parseFloat(localValue));
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
	};
	return (
		<div className={rootName}>
			<input {...inputProps} />
			<fieldset className={fieldsetName}>
				<legend className={classes.legend}>{label}</legend>
			</fieldset>
			<div className={classes.groovedWheel}>
				<GroovedWheel {...groovedWheelProps} />
			</div>
		</div>
	);
};
