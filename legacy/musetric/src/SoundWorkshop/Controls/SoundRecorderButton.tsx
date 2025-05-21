import React from 'react';
import { useAppLocale } from '../../App/AppContext';
import { Button, ButtonProps } from '../../Controls/Button';
import { Icon } from '../../Controls/Icon';
import { SFC } from '../../UtilityTypes/React';
import { skipPromise } from '../../Utils/SkipPromise';
import { SoundWorkshopSnapshot, useSoundWorkshopStore } from '../SoundWorkshopContext';

const select = ({
    isPlaying, isRecording, setIsRecording, getRecorder,
}: SoundWorkshopSnapshot) => ({
    isPlaying, isRecording, setIsRecording, getRecorder,
} as const);

export const SoundRecorderButton: SFC = () => {
    const store = useSoundWorkshopStore(select);
    const { isPlaying, isRecording, setIsRecording, getRecorder } = store;

    const { i18n } = useAppLocale();

    const startRecording = async (): Promise<void> => {
        const recorder = await getRecorder();
        await recorder.start();
        setIsRecording(true);
    };
    const stopRecording = async (): Promise<void> => {
        const recorder = await store.getRecorder();
        await recorder.stop();
        setIsRecording(false);
    };

    const recorderProps: ButtonProps = {
        kind: 'icon',
        disabled: isPlaying,
        rounded: true,
        title: i18n.t('Workshop:record'),
        primary: isRecording,
        onClick: () => {
            if (isRecording) {
                skipPromise(stopRecording());
                return;
            }
            skipPromise(startRecording());
        },
    };

    return (
        <Button {...recorderProps}>
            <Icon name='record' />
        </Button>
    );
};
