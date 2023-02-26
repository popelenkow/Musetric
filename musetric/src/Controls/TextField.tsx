import React from 'react';
import { createUseClasses, createClasses, className } from '../AppContexts/Css';
import { SFC } from '../UtilityTypes/React';

export const getTextFieldClasses = createClasses((css) => {
	const { theme } = css;
	const activeSelector = ['&:not(:focus-within):active', '&:not(:focus-within).active', '.hoverable &:not(:focus-within):hover'];
	return {
		root: {
			position: 'relative',
			height: '42px',
			'min-height': '42px',
			'font-family': 'Verdana, Arial, sans-serif',
			[`${activeSelector.map((x) => x.concat(' > fieldset')).join(', ')}`]: {
				'border-color': theme.content,
			},
			'&:focus-within > fieldset': {
				'border-color': theme.primary,
				color: theme.primary,
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
			color: theme.content,
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
			color: theme.content,
			border: '1px solid',
			position: 'absolute',
			'border-color': theme.divider,
			'pointer-events': 'none',
			'&.rounded': {
				'border-radius': '10px',
			},
			'&.noBottomBorder': {
				'border-bottom-color': 'transparent !important',
			},
		},
		legend: {
			'font-size': '10px',
			padding: '0 6px',
			'pointer-events': 'auto',
		},
	};
});
const useClasses = createUseClasses('TextField', getTextFieldClasses);

export type TextFieldProps = {
	value: string,
	label?: string,
	disabled?: boolean,
	rounded?: boolean,
	active?: boolean,
	noBottomBorder?: boolean,
};
export const TextField: SFC<TextFieldProps> = (props) => {
	const {
		value, label,
		disabled, active, rounded, noBottomBorder,
	} = props;

	const classes = useClasses();
	const fieldsetName = className(
		classes.fieldset,
		{ disabled, rounded, active, noBottomBorder },
	);

	return (
		<div className={classes.root}>
			<input className={classes.input} type='text' defaultValue={value} />
			<fieldset className={fieldsetName}>
				<legend className={classes.legend}>{label}</legend>
			</fieldset>
		</div>
	);
};
