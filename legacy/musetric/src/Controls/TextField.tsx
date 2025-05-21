import React from 'react';
import { createUseClasses } from '../App/AppCss';
import { themeVariables } from '../AppBase/Theme';
import { SFC } from '../UtilityTypes/React';
import { getClassNames } from '../Utils/ClassName';

const activeSelector = ['&:not(:focus-within):active', '&--active', '.hoverable &:not(:focus-within):hover'];

const useClasses = createUseClasses('TextField', {
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
        'pointer-events': 'none',
        '&--rounded': {
            'border-radius': '10px',
        },
    },
    legend: {
        'font-size': '10px',
        padding: '0 6px',
        'pointer-events': 'auto',
    },
});

export type TextFieldProps = {
    value: string,
    label?: string,
    disabled?: boolean,
    rounded?: boolean,
    active?: boolean,
};
export const TextField: SFC<TextFieldProps> = (props) => {
    const {
        value,
        label,
        disabled,
        active,
        rounded,
    } = props;

    const classes = useClasses();
    const fieldsetName = getClassNames(classes.fieldset, {
        disabled,
        rounded,
        active,
    });

    return (
        <div className={classes.root}>
            <input className={classes.input} type='text' defaultValue={value} />
            <fieldset className={fieldsetName}>
                <legend className={classes.legend}>{label}</legend>
            </fieldset>
        </div>
    );
};
