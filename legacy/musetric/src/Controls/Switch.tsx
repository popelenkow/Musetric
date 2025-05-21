import React, { useState } from 'react';
import { ChildrenProps, FCResult } from '../UtilityTypes/React';
import { Button, ButtonProps } from './Button';

export type SwitchProps<T> = {
    kind?: 'simple' | 'icon' | 'full',
    align?: 'left' | 'center' | 'right',
    disabled?: boolean,
    primary?: boolean,
    rounded?: boolean,
    title?: string,
    currentId: T,
    ids: T[],
    set: (id: T) => void,
};
type SwitchFC = (
    <T>(props: SwitchProps<T> & ChildrenProps) => FCResult
);
export const Switch: SwitchFC = (props) => {
    const {
        kind,
        disabled,
        primary,
        rounded,
        title,
        currentId,
        ids,
        set,
        children,
    } = props;

    const [id, setId] = useState(currentId);

    const next = (): void => {
        let index = ids.indexOf(id);
        index = (index + 1) % ids.length;
        const newId = ids[index];
        setId(newId);
        set(newId);
    };

    const buttonProps: ButtonProps = {
        kind,
        disabled,
        primary,
        rounded,
        title,
        onClick: next,
    };
    return (
        <Button {...buttonProps}>
            {children}
        </Button>
    );
};
