import React from 'react';
import { createUseClasses } from '../../../App/AppCss';
import { themeVariables } from '../../../AppBase/Theme';
import { ScrollArea } from '../../../Controls/ScrollArea';
import { TextField, TextFieldProps } from '../../../Controls/TextField';
import { SFC } from '../../../UtilityTypes/React';
import { SoundWorkshopSnapshot, useSoundWorkshopStore } from '../../SoundWorkshopContext';
import { FrequencyRangeParameter } from './frequency';

const useClasses = createUseClasses('SoundParameters', {
    root: {
        background: `var(${themeVariables.backgroundPanel})`,
        'box-sizing': 'border-box',
        'border-top': `1px solid var(${themeVariables.divider})`,
        height: '100%',
        width: '100%',
    },
    list: {
        padding: '15px',
        display: 'flex',
        'flex-direction': 'column',
        'row-gap': '15px',
    },
});

const SoundParametersPanel: SFC = () => {
    const classes = useClasses();

    const textFieldProps: TextFieldProps = {
        value: 'qwe',
        label: 'text',
        rounded: true,
    };
    return (
        <div className={classes.root}>
            <ScrollArea>
                <div className={classes.list}>
                    <FrequencyRangeParameter />
                    <TextField {...textFieldProps} />
                    <TextField {...textFieldProps} />
                    <TextField {...textFieldProps} />
                    <TextField {...textFieldProps} />
                    <TextField {...textFieldProps} />
                    <TextField {...textFieldProps} />
                    <TextField {...textFieldProps} />
                </div>
            </ScrollArea>
        </div>
    );
};

const select = ({
    isOpenParameters,
}: SoundWorkshopSnapshot) => ({
    isOpenParameters,
} as const);

const WithHidden: SFC<object, { result: 'optional' }> = () => {
    const store = useSoundWorkshopStore(select);
    const { isOpenParameters } = store;

    if (!isOpenParameters) return null;
    return <SoundParametersPanel />;
};

export {
    WithHidden as SoundParametersPanel,
};
