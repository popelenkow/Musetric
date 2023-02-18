import React from 'react';
import { createUseClasses, createClasses, className } from '../AppContexts/Css';
import { SFC } from '../UtilityTypes';

export const getTextFieldClasses = createClasses((css) => {
	const { theme, platform } = css;
	return {
		root: {
			position: 'relative',
			height: '42px',
			'min-height': '42px',
			'font-family': 'Verdana, Arial, sans-serif',
			[platform.platformId === 'mobile' ? '&:active > fieldset' : '&:hover > fieldset']: {
				'border-color': theme.activeContent,
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
			color: theme.activeContent,
			width: '100%',
			'margin-top': '3px',
			'&:focus-visible + fieldset': {
				'border-color': theme.activePrimary,
				color: theme.activePrimary,
			},
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
			color: theme.activeContent,
			border: '1px solid',
			position: 'absolute',
			'border-color': theme.divider,
			'pointer-events': 'none',
			'&.rounded': {
				'border-radius': '10px',
			},
			'&.active': {
				'border-color': theme.activeContent,
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
	primary?: boolean,
	rounded?: boolean,
};
export const TextField: SFC<TextFieldProps> = (props) => {
	const {
		value, label,
		disabled, primary, rounded,
	} = props;

	const classes = useClasses();
	const fieldsetName = className(
		classes.fieldset,
		{ value: { disabled, primary, rounded } },
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
