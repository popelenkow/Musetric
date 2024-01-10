import React, { useCallback, useRef, useState } from 'react';
import { createUseClasses, className } from '../App/AppCss';
import { themeVariables } from '../AppBase/Theme';
import { SFC } from '../UtilityTypes/React';
import { useAnimation } from '../UtilsReact/Animation';
import { GroovedWheel, GroovedWheelProps } from './GroovedWheel';

const activeSelector = ['&:not(:focus-within):active', '&:not(:focus-within).active', '.hoverable &:not(:focus-within):hover'];

const useClasses = createUseClasses('NumberField', {
	root: {
		position: 'relative',
		height: '42px',
		'min-height': '42px',
		'font-family': 'Verdana, Arial, sans-serif',
		[`${activeSelector.map((x) => x.concat(' > fieldset')).join(', ')}`]: {
			'border-color': `var(${themeVariables.content})`,
		},
		'&:focus-within > fieldset': {
			'border-color': `var(${themeVariables.primary})`,
			color: `var(${themeVariables.primary})`,
		},
		[`${activeSelector.map((x) => x.concat(' > .NumberField__groovedWheel > *')).join(', ')}`]: {
			'background-color': `var(${themeVariables.content})`,
		},
		'&:focus-within > .NumberField__groovedWheel > *': {
			'background-color': `var(${themeVariables.primary})`,
		},
	},
	input: {
		margin: '0',
		outline: 'none',
		'box-sizing': 'border-box',
		padding: '0 12px',
		'background-color': 'transparent',
		height: '100%',
		'font-size': '18px',
		border: '1px solid',
		'border-color': 'transparent',
		color: `var(${themeVariables.content})`,
		width: '100%',
		'margin-top': '3px',
		'&.rounded': {
			'border-radius': '10px',
		},
	},
	fieldset: {
		margin: '0',
		outline: 'none',
		'box-sizing': 'border-box',
		inset: '0px',
		'background-color': 'transparent',
		'font-size': '18px',
		color: `var(${themeVariables.content})`,
		border: '1px solid',
		position: 'absolute',
		'border-color': `var(${themeVariables.divider})`,
		'border-bottom-color': 'transparent !important',
		'pointer-events': 'none',
		'&.rounded': {
			'border-radius': '10px',
		},
	},
	legend: {
		'font-size': '10px',
		padding: '0 6px',
		'pointer-events': 'auto',
	},
	groovedWheel: {
		position: 'absolute',
		cursor: 'ew-resize',
		bottom: '0px',
		height: '8px',
		left: '12px',
		right: '12px',
	},
});

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
