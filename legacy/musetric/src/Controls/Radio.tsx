import React from 'react';
import { createUseClasses } from '../App/AppCss';
import { themeVariables } from '../AppBase/Theme';
import { ChildrenProps, FCResult } from '../UtilityTypes/React';
import { getClassNames } from '../Utils/ClassName';

const useClasses = createUseClasses('Radio', {
    root: {
        display: 'block',
    },
    input: {
        position: 'absolute',
        opacity: '0',
        '&:focus-visible + *': {
            border: `1px solid var(${themeVariables.divider})`,
        },
    },
    button: {
        display: 'flex',
        margin: '0',
        outline: 'none',
        'font-family': 'Verdana, Arial, sans-serif',
        'box-sizing': 'border-box',
        'align-items': 'center',
        height: '42px',
        'min-height': '42px',
        'font-size': '18px',
        padding: '0 6px',
        'background-color': 'transparent',
        'justify-content': 'center',
        border: '1px solid',
        'border-color': 'transparent',
        'user-select': 'none',
        cursor: 'pointer',
        '-webkit-tap-highlight-color': 'transparent',
        color: `var(${themeVariables.content})`,
        '& svg': {
            fill: `var(${themeVariables.content})`,
        },
        '.hoverable &:hover:not(:active)': {
            'background-color': `var(${themeVariables.contentHover})`,
        },
        '&:active': {
            'background-color': `var(${themeVariables.contentHoverActive})`,
        },
        '&--rounded': {
            'border-radius': '10px',
        },
        '&--icon': {
            padding: '0',
            width: '42px',
            'min-width': '42px',
        },
        '&--full': {
            padding: '0 6px',
            width: '100%',
        },
        '&--left': {
            'justify-content': 'left',
        },
        '&--right': {
            'justify-content': 'right',
        },
        '&:focus-visible': {
            'border-color': `var(${themeVariables.content})`,
        },
        '&[disabled]': {
            cursor: 'default',
            '&:active, .hoverable &:hover': {
                'background-color': 'transparent',
            },
            opacity: '0.4',
        },
        '&--primary': {
            color: `var(${themeVariables.primary})`,
            '& svg': {
                fill: `var(${themeVariables.primary})`,
            },
            '.hoverable &:hover:not(:active)': {
                'background-color': `var(${themeVariables.primaryHover})`,
            },
            '&:active': {
                'background-color': `var(${themeVariables.primaryHoverActive})`,
            },
            '&:focus-visible': {
                'border-color': `var(${themeVariables.primary})`,
            },
        },
    },
});

export type RadioProps<Value extends string> = {
    kind?: 'simple' | 'icon' | 'full',
    align?: 'left' | 'center' | 'right',
    disabled?: boolean,
    primary?: boolean,
    rounded?: boolean,
    title?: string,
    onSelected: (value: Value) => void,
    label: string,
    value: Value,
    checkedValue: Value,
};
type RadioFC = (
    <Value extends string>(props: RadioProps<Value> & ChildrenProps) => FCResult
);
export const Radio: RadioFC = (props) => {
    type Value = (typeof props)['value'];
    const {
        kind,
        align,
        disabled,
        primary,
        rounded,
        title,
        onSelected,
        label,
        value,
        checkedValue,
        children,
    } = props;
    const classes = useClasses();

    const checked = checkedValue === value;
    const buttonName = getClassNames(classes.button, {
        [kind ?? 'simple']: true,
        [align ?? 'center']: true,
        primary,
        rounded,
    });

    return (
        <label className={classes.root} title={title}>
            <input
                className={classes.input}
                type='radio'
                name={label}
                value={value}
                onChange={(event): void => {
                    if (disabled) return;
                    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                    onSelected(event.target.value as Value);
                }}
                checked={checked}
            />
            <div className={buttonName}>
                {children}
            </div>
        </label>
    );
};
