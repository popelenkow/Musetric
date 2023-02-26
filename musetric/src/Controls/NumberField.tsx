import React, { useCallback, useRef, useState } from 'react';
import { createUseClasses, createClasses, className } from '../AppContexts/Css';
import { SFC } from '../UtilityTypes/React';
import { useAnimation } from '../UtilsReact/Animation';
import { GroovedWheel, GroovedWheelProps } from './GroovedWheel';
import { getTextFieldClasses } from './TextField';

export const getNumberFieldClasses = createClasses((css) => {
	const { theme } = css;
	const textFieldClasses = getTextFieldClasses(css);
	return {
		root: {
			...textFieldClasses.root,
			'&:active > .NumberField-groovedWheel > *, &.active > .NumberField-groovedWheel > *': {
				'background-color': theme.content,
			},
			'.hoverable &:hover:not(:focus-within) > .NumberField-groovedWheel > *': {
				'background-color': theme.content,
			},
			'&:focus-within > .NumberField-groovedWheel > *': {
				'background-color': theme.primary,
			},
		},
		input: {
			...textFieldClasses.input,
		},
		fieldset: {
			...textFieldClasses.fieldset,
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
		{ disabled, rounded, noBottomBorder: true },
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
