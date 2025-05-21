import React from 'react';
import { createUseClasses } from '../App/AppCss';
import { themeVariables } from '../AppBase/Theme';
import { SFC } from '../UtilityTypes/React';
import { getClassNames } from '../Utils/ClassName';

const useClasses = createUseClasses('Field', {
    root: {
        display: 'flex',
        margin: '0',
        outline: 'none',
        'font-family': 'Verdana, Arial, sans-serif',
        'box-sizing': 'border-box',
        'align-items': 'center',
        padding: '0 6px',
        'background-color': 'transparent',
        height: '42px',
        'min-height': '42px',
        'font-size': '18px',
        'justify-content': 'center',
        border: '1px solid',
        'border-color': 'transparent',
        color: `var(${themeVariables.content})`,
        '& svg': {
            fill: `var(${themeVariables.content})`,
        },
        '&:focus-visible': {
            'border-color': `var(${themeVariables.divider})`,
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
        '&--primary': {
            color: `var(${themeVariables.primary})`,
            '& svg': {
                fill: `var(${themeVariables.primary})`,
            },
        },
    },
});

export type FieldProps = {
    kind?: 'simple' | 'icon' | 'full',
    align?: 'left' | 'center' | 'right',
    primary?: boolean,
    rounded?: boolean,
};
export const Field: SFC<FieldProps, { children: 'required' }> = (props) => {
    const {
        kind,
        align,
        primary,
        rounded,
        children,
    } = props;

    const classes = useClasses();
    const rootName = getClassNames(classes.root, {
        [kind ?? 'simple']: true,
        [align ?? 'center']: true,
        primary,
        rounded,
    });

    return (
        <div className={rootName}>
            {children}
        </div>
    );
};
