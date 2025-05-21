import React from 'react';
import { themeVariables } from '../AppBase/Theme';
import { Icon } from '../Controls/Icon';
import { SFC } from '../UtilityTypes/React';
import { createUseClasses } from './AppCss';

const useClasses = createUseClasses('AppBar', {
    root: {
        display: 'flex',
        'box-sizing': 'border-box',
        width: '100%',
        height: '100%',
        'column-gap': '4px',
        background: `var(${themeVariables.backgroundPanel})`,
        padding: '0px 4px',
        'align-items': 'center',
        'justify-content': 'center',
        'border-bottom': `1px solid var(${themeVariables.divider})`,
    },
    icon: {
        display: 'flex',
        margin: '0',
        outline: 'none',
        'font-family': 'Verdana, Arial, sans-serif',
        'box-sizing': 'border-box',
        'align-items': 'center',
        'background-color': 'transparent',
        height: '42px',
        'min-height': '42px',
        'font-size': '18px',
        'justify-content': 'center',
        border: '1px solid',
        'border-color': 'transparent',
        color: `var(${themeVariables.content})`,
        padding: '0',
        width: '42px',
        'min-width': '42px',
        'max-width': '42px',
        'max-height': '42px',
        'flex-grow': '1',
        '& svg': {
            fill: `var(${themeVariables.content})`,
        },
    },
    text: {
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
        border: '1px solid',
        'border-color': 'transparent',
        color: `var(${themeVariables.content})`,
        'justify-content': 'left',
        'flex-grow': '2',
        'user-select': 'none',
        'max-height': '42px',
        width: 'auto',
    },
});

export const AppBar: SFC<object, { children: 'required' }> = (props) => {
    const { children } = props;
    const classes = useClasses();

    return (
        <div className={classes.root}>
            <div className={classes.icon}><Icon name='app' /></div>
            <div className={classes.text}>Musetric</div>
            {children}
        </div>
    );
};
