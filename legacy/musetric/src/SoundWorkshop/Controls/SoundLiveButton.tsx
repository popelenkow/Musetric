import React from 'react';
import { useAppLocale } from '../../App/AppContext';
import { Button, ButtonProps } from '../../Controls/Button';
import { Icon } from '../../Controls/Icon';
import { SFC } from '../../UtilityTypes/React';
import { skipPromise } from '../../Utils/SkipPromise';
import { SoundWorkshopSnapshot, useSoundWorkshopStore } from '../SoundWorkshopContext';

const select = ({
    isLive, setIsLive, getRecorder,
}: SoundWorkshopSnapshot) => ({
    isLive, setIsLive, getRecorder,
} as const);

export const SoundLiveButton: SFC = () => {
    const store = useSoundWorkshopStore(select);
    const { isLive, setIsLive, getRecorder } = store;

    const { i18n } = useAppLocale();

    const liveProps: ButtonProps = {
        kind: 'icon',
        rounded: true,
        title: i18n.t('Workshop:live'),
        primary: isLive,
        onClick: () => {
            setIsLive(!isLive);
            skipPromise(getRecorder());
        },
    };
    return (
        <Button {...liveProps}>
            <Icon name='live' />
        </Button>
    );
};
