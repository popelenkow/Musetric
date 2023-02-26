import React from 'react';
import { useIconContext } from '../../AppContexts/Icon';
import { useLocaleContext } from '../../AppContexts/Locale';
import { Button, ButtonProps } from '../../Controls/Button';
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

	const { LiveIcon } = useIconContext();
	const { i18n } = useLocaleContext();

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
			<LiveIcon />
		</Button>
	);
};
