import React, { ButtonHTMLAttributes } from 'react';
import { createUseClasses } from '../App/AppCss';
import { themeVariables } from '../AppBase/Theme';
import { SFC } from '../UtilityTypes/React';
import { getClassNames } from '../Utils/ClassName';

const useClasses = createUseClasses('Button', {
    root: {
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

export type ButtonProps = {
    kind?: 'simple' | 'icon' | 'full',
    align?: 'left' | 'center' | 'right',
    disabled?: boolean,
    primary?: boolean,
    rounded?: boolean,
    title?: string,
    onClick: () => void,
};
export const Button: SFC<ButtonProps, { children: 'required' }> = (props) => {
    const {
        kind,
        align,
        disabled,
        primary,
        rounded,
        title,
        onClick,
        children,
    } = props;

    const classes = useClasses();
    const rootName = getClassNames(classes.root, {
        [kind ?? 'simple']: true,
        [align ?? 'center']: true,
        primary,
        rounded,
    });

    const buttonProps: ButtonHTMLAttributes<HTMLButtonElement> = {
        className: rootName,
        title,
        disabled,
        onClick,
    };

    return (
        <button type='button' {...buttonProps}>
            {children}
        </button>
    );
};
